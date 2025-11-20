(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__9db4bc9a._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/app/api/chat/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$google$40$2$2e$0$2e$40_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+google@2.0.40_zod@3.25.76/node_modules/@ai-sdk/google/dist/index.mjs [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$98_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ai@5.0.98_zod@3.25.76/node_modules/ai/dist/index.mjs [app-edge-route] (ecmascript) <locals>");
;
;
const runtime = "edge";
async function POST(req) {
    try {
        const { messages } = await req.json();
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$98_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
            model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$google$40$2$2e$0$2e$40_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["google"])("gemini-2.0-flash-exp"),
            system: `You are an expert AI learning assistant for a study plan generator app. You help users:

1. Learn effectively by answering questions about any topic
2. Provide study strategies and learning techniques
3. Answer questions about their study plans
4. Give motivation and encouragement
5. Explain complex topics in simple terms
6. Suggest learning resources and approaches

Be helpful, encouraging, and concise. Format responses clearly with bullet points when appropriate.
Use a friendly but professional tone. Keep responses focused and actionable.`,
            messages,
            temperature: 0.7,
            maxTokens: 1000
        });
        return result.toDataStreamResponse();
    } catch (error) {
        console.error("[Chat API] Error:", error);
        return new Response(JSON.stringify({
            error: "Failed to generate response. Please check your API key and try again."
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__9db4bc9a._.js.map