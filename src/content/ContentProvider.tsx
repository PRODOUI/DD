import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { defaultContent, type SiteContent } from '../data/site';
import { setAt, toContent, type Path } from './utils';

/**
 * مصادر المحتوى بترتيب الأولوية (الأعلى يغلب):
 *   1) مسودة محفوظة في هذا المتصفح (localStorage) — تعديلات صاحب الموقع قبل النشر
 *   2) الملف المنشور  content.json  الموجود بجانب index.html — يراه كل الزوار
 *   3) المحتوى الافتراضي المكتوب في  src/data/site.ts
 */
const STORAGE_KEY = 'afrah-zoubir-content-v1';

export type SaveState = 'idle' | 'saved' | 'error';

interface ContentContextValue {
  content: SiteContent;
  /** هل توجد تعديلات محفوظة في هذا المتصفح؟ */
  hasDraft: boolean;
  saveState: SaveState;
  update: (path: Path, value: unknown) => void;
  /** استبدال المحتوى كله (عند استيراد ملف) */
  replaceAll: (saved: unknown) => void;
  /** حذف التعديلات المحلية والعودة إلى المحتوى المنشور */
  reset: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

function readDraft(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? toContent(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

/** تحميل الملف المنشور يبدأ فور فتح الصفحة */
const publishedRequest: Promise<unknown> = fetch('content.json', { cache: 'no-cache' })
  .then((res) => (res.ok ? res.json() : null))
  .catch(() => null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SiteContent | null>(readDraft);
  const [published, setPublished] = useState<SiteContent>(defaultContent);
  // لا نعرض الصفحة قبل معرفة المحتوى المنشور، حتى لا يرى الزائر نصوصًا قديمة للحظة
  const [ready, setReady] = useState(() => draft !== null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    let alive = true;
    // مهلة قصوى: إن تأخر الملف نعرض المحتوى الافتراضي
    const timer = window.setTimeout(() => alive && setReady(true), 1200);
    publishedRequest.then((json) => {
      if (!alive) return;
      if (json) setPublished(toContent(json));
      setReady(true);
      window.clearTimeout(timer);
    });
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  // حفظ تلقائي للمسودة بعد توقف الكتابة بقليل
  useEffect(() => {
    if (draft === null) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft]);

  const update = useCallback(
    (path: Path, value: unknown) => setDraft((prev) => setAt(prev ?? published, path, value)),
    [published],
  );

  const replaceAll = useCallback((saved: unknown) => setDraft(toContent(saved)), []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* لا شيء */
    }
    setDraft(null);
    setSaveState('idle');
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content: draft ?? published,
      hasDraft: draft !== null,
      saveState,
      update,
      replaceAll,
      reset,
    }),
    [draft, published, saveState, update, replaceAll, reset],
  );

  if (!ready) return null;
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

function useContentContext(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return ctx;
}

/** محتوى الموقع الحالي — يُستعمل في كل المكوّنات */
export function useContent(): SiteContent {
  return useContentContext().content;
}

/** أدوات التعديل — تُستعمل في لوحة التعديل فقط */
export function useContentAdmin(): ContentContextValue {
  return useContentContext();
}
