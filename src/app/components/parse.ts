import Parse from "parse/node";

const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID!;
const jsKey = process.env.NEXT_PUBLIC_PARSE_JS_KEY!;
const serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL!;

if (!appId || !jsKey || !serverURL) {
  throw new Error("❌ Missing Parse ENV variables");
}

Parse.initialize(appId, jsKey);
Parse.serverURL = serverURL;

export default Parse;
