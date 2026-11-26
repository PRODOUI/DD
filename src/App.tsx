import { useCallback, useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { About } from './components/About';
import { Areas } from './components/Areas';
import { Dishes } from './components/Dishes';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Packages } from './components/Packages';
import { QuoteForm } from './components/QuoteForm';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { Video } from './components/Video';
import { WhyUs } from './components/WhyUs';
import { ContentProvider, useContent, useContentAdmin } from './content/ContentProvider';
import { ContentEditor } from './editor/ContentEditor';

/** الرابط الذي يفتح لوحة التعديل: أضف  #edit  في آخر عنوان الموقع */
const EDIT_HASH = '#edit';

/**
 * الصفحة الرئيسية — ترتيب الأقسام كما يظهر للزائر.
 * لتغيير الترتيب: حرّك السطر المقابل للقسم داخل <main>.
 * لتغيير المحتوى: لوحة التعديل (#edit) أو الملف  src/data/site.ts
 */
function Site() {
  const c = useContent();
  const { hasDraft } = useContentAdmin();

  // الباقة التي اختارها الزائر من قسم الباقات تنتقل تلقائيًا إلى نموذج الطلب
  const [packageName, setPackageName] = useState('');
  const [editing, setEditing] = useState(() => window.location.hash === EDIT_HASH);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === EDIT_HASH) setEditing(true);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const closeEditor = useCallback(() => {
    setEditing(false);
    if (window.location.hash === EDIT_HASH) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      <a
        href="#main"
        className="btn btn-gold fixed start-4 top-3 z-[80] -translate-y-24 focus-visible:translate-y-0"
      >
        تخطَّ إلى المحتوى
      </a>

      <Header />

      <main id="main">
        <Hero />
        {c.about.visible && <About />}
        {c.services.visible && <Services />}
        {c.dishes.visible && <Dishes />}
        {c.packages.visible && <Packages onSelect={setPackageName} />}
        {c.why.visible && <WhyUs />}
        {c.gallery.visible && <Gallery />}
        {c.video.visible && <Video />}
        {c.testimonials.visible && <Testimonials />}
        {c.areas.visible && <Areas />}
        <QuoteForm packageName={packageName} onPackageChange={setPackageName} />
      </main>

      <Footer />
      <FloatingActions />

      {editing ? (
        <ContentEditor onClose={closeEditor} />
      ) : (
        // يظهر فقط في المتصفح الذي فيه تعديلات غير منشورة
        hasDraft && (
          <a
            href={EDIT_HASH}
            className="fixed start-4 bottom-4 z-40 flex items-center gap-2.5 rounded-full bg-olive-800 py-2 ps-3 pe-5 text-cream-50 shadow-soft ring-1 ring-gold-400/60 transition-colors hover:bg-olive-700"
          >
            <span className="grid size-9 place-items-center rounded-full bg-gold-400 text-olive-950">
              <Pencil className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block font-bold">تعديل المحتوى</span>
              <span className="block text-[0.8rem] text-cream-100/75">نسخة معدّلة في هذا المتصفح</span>
            </span>
          </a>
        )
      )}
    </>
  );
}

export function App() {
  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  );
}

export default App;
