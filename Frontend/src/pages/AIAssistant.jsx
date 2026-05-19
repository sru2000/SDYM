import AIAssistantWidget from "../components/dashboard/AIAssistantWidget.jsx";
import PageScaffold from "../components/layout/PageScaffold.jsx";

function AIAssistant() {
  return (
    <div className="space-y-6">
      <PageScaffold
        eyebrow="Conversational intelligence"
        title="AI Assistant"
        description="Ask crop, weather, pest, and advisory questions using the same intelligence layer that powers dashboard recommendations."
      />
      <AIAssistantWidget />
    </div>
  );
}

export default AIAssistant;
