export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Datasets / Model Monitoring</h1>
        <p className="text-sm text-slate-600 mb-6">View model performance and upload datasets for retraining.</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Placeholder: Model metrics (accuracy, AUC), dataset upload, AI logs.</p>
        </div>
      </div>
    </div>
  );
}
