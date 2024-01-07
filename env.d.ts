interface NewNote {
  slug: string;
  title: string;
  markdown: string;
}

interface Note extends NewNote {
  id: number;
  createdAt?: number;
  updatedAt?: number;
}

interface NoteSlugAndTitle {
  slug: string;
  title: string;
}

interface NewTag {
  slug: string;
  title: string;
}

interface Tag extends NewTag {
  id: number;
}

interface Env {
  WORKER_HOST: string;
  DB: D1Database;
}
