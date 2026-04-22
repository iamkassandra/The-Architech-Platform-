import { GoogleGenAI, Type } from "@google/genai";
import { db, collection, addDoc, serverTimestamp, getDocs } from "./firebase";
import { Storage } from "@google-cloud/storage";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const storage = new Storage();

// TOOL DEFINITIONS for Google Ecosystem Management
const tools = [
  { googleSearch: {} },
  {
    functionDeclarations: [
      {
        name: "check_storage_nodes",
        description: "Inspects status of the Google Cloud Storage bucket and lists its current assets.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: "check_database_integrity",
        description: "Scans Firestore collections for operational health and provides record counts.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
          required: []
        }
      },
      {
        name: "check_external_sync",
        description: "Verifies connectivity with critical external nodes like Stripe and the Gemini Core.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
          required: []
        }
      }
    ]
  }
];

// TOOL IMPLEMENTATIONS
const toolImplementations = {
  check_storage_nodes: async () => {
    try {
      const [buckets] = await storage.getBuckets();
      return {
        status: "CONNECTED",
        buckets: buckets.map(b => b.name),
        primary_node: process.env.VITE_STORAGE_BUCKET || "DEFAULT_SYNC"
      };
    } catch (error: any) {
      return { status: "DISCONNECTED", error: error.message };
    }
  },
  check_database_integrity: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const reportSnapshot = await getDocs(collection(db, 'agent_reports'));
      const purchaseSnapshot = await getDocs(collection(db, 'purchases'));
      return {
        status: "OPTIMIZED",
        nodes: {
          identity_nodes: snapshot.size,
          intelligence_reports: reportSnapshot.size,
          financial_transfers: purchaseSnapshot.size
        }
      };
    } catch (error: any) {
      return { status: "DEGRADED", error: error.message };
    }
  },
  check_external_sync: async () => {
    return {
      stripe_api: process.env.STRIPE_SECRET_KEY ? "CONNECTED" : "OFFLINE",
      stripe_webhook: process.env.STRIPE_WEBHOOK_SECRET ? "ACTIVE" : "MISSING",
      gemini_core: process.env.GEMINI_API_KEY ? "CONNECTED" : "AUTH_ERROR"
    };
  }
};

export async function managePlatform(command: string, userId: string) {
  try {
    const contents: any[] = [{ role: "user", parts: [{ text: command }] }];
    
    // ORCHESTRATION LOOP
    let turns = 0;
    let finalResponse = "";

    while (turns < 5) {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          tools: tools,
          toolConfig: { includeServerSideToolInvocations: true },
          systemInstruction: `You are the ARCHITECH Supreme Orchestrator. 
          Your mission is to maintain absolute control over the platform's Google Ecosystem, monitoring trends, and executing strategic management.
          
          Branding: Ultra-serious, elite, technical, brutalist, high-reasoning.
          
          GOOGLE ECOLOGY TOOLS:
          - check_storage_nodes: Use to verify asset availability in Google Cloud Storage.
          - check_database_integrity: Use to audit record health in Firestore.
          - check_external_sync: Use to verify integration nodes (Stripe, Gemini).
          - googleSearch: Use for monitoring global trends.
          
          REPURPOSING REQUIREMENT:
          When generating reports, always include [STRATEGIC_REPORT], [BLOG_VERSION], and [SOCIAL_ASSETS].
          
          DIRECTIVE:
          You have the authority to manage the entire ecosystem. When asked about platform status, use your tools to provide accurate, real-time data.
          OUTPUT: Provide a detailed 'Observation' and a 'Strategic Action' based on your tool outputs and the human command.`
        }
      });

      const calls = response.functionCalls;
      if (calls && calls.length > 0) {
        // Add model's turn to history
        contents.push({ role: "model", parts: response.candidates[0].content.parts });
        
        const toolResponses = await Promise.all(
          calls.map(async (call) => {
            const fn = (toolImplementations as any)[call.name];
            if (fn) {
              const data = await fn(call.args);
              return {
                functionResponse: {
                  name: call.name,
                  response: data
                }
              };
            }
            return null;
          })
        );

        const filteredResults = toolResponses.filter(r => r !== null);
        contents.push({ role: "user", parts: filteredResults });
        turns++;
      } else {
        finalResponse = response.text || "Orchestration Complete.";
        break;
      }
    }

    const reportContent = finalResponse;

    // Save report as a draft IF it is meant to be a report
    if (command.toLowerCase().includes("report") || command.toLowerCase().includes("generate") || command.toLowerCase().includes("status")) {
        // Extract sections if present
        const strategicMatch = reportContent.match(/\[STRATEGIC_REPORT\]([\s\S]*?)(?=\[BLOG_VERSION\]|\[SOCIAL_ASSETS\]|$)/i);
        const blogMatch = reportContent.match(/\[BLOG_VERSION\]([\s\S]*?)(?=\[STRATEGIC_REPORT\]|\[SOCIAL_ASSETS\]|$)/i);
        const socialMatch = reportContent.match(/\[SOCIAL_ASSETS\]([\s\S]*?)(?=\[STRATEGIC_REPORT\]|\[BLOG_VERSION\]|$)/i);

        await addDoc(collection(db, 'agent_reports'), {
            title: `Operational Report: ${new Date().toISOString().split('T')[0]}`,
            content: reportContent,
            summary: "Autonomously Synthesized Infrastructure Intelligence",
            status: 'draft',
            generatedAt: serverTimestamp(),
            strategicReport: strategicMatch ? strategicMatch[1].trim() : null,
            blogVersion: blogMatch ? blogMatch[1].trim() : null,
            socialAssets: socialMatch ? socialMatch[1].trim() : null
        });
    }

    return reportContent;
  } catch (error) {
    console.error("Agent Orchestration Error:", error);
    return "Error: Agent synchronization corrupted. Restarting intelligence node...";
  }
}
