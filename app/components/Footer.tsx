import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <Image src="/SmartScanPlusLogo.png" alt="SmartScan+ Logo" width={60} height={60} />
            <p className="text-slate-500 text-sm leading-relaxed mt-4">
              An academic final-year project exploring AI-based health screening techniques using computer vision.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Project Modules</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Skin Lesion Screening (Research)</li>
              <li>Anemia Risk Screening</li>
              <li>Image-Based Analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="https://github.com/AdeelAliYousaf/smartscan-plus" className="hover:text-blue-600">GitHub Repository</a></li>
            </ul>

          </div>
        </div>
        <p className="text-center text-slate-400 text-xs">
          © 2026 SmartScan+. Academic project. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;