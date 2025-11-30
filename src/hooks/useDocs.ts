import { api } from "@/services/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Docs {
  id: string;
  title: string;
  note: string;
}

export function useDocs() {
  const [docs, setDocs] = useState<Docs[]>([]);
  const [error, set_error] = useState(false);

  const fetchDocs = async () => {
    const { data } = await api.get("/");
    setDocs(data.data);
  };

  const createDoc = async (title: string, content: string) => {
    set_error(false);
    try {
      const { data } = await api.post("/", { title, content });
      toast.success(data.message);
      setDocs((prev) => [...prev, data.data]);
    } catch (err: any) {
      set_error(true);
      if (err.response) toast.error(err.response.data.message);
      else toast.error(err.message);
    }
  };

  const updateDoc = async (id: string, title: string, content: string) => {
    set_error(false);
    try {
      const { data } = await api.put(`/update/${id}`, { title, content });
      toast.success(data.message);
      setDocs((prev) => prev.map((n) => (n.id === id ? data.data : n)));
    } catch (err: any) {
      set_error(true);
      if (err.response) toast.error(err.response.data.message);
      else toast.error(err.message);
    }
  };

  const deleteDoc = async (id: string) => {
    set_error(false);
    try {
      const { data } = await api.delete(`/delete/${id}`);
      setDocs((prev) => prev.filter((n) => n.id !== id));
      toast.success(data.message);
    } catch (err: any) {
      set_error(true);
      if (err.response) toast.error(err.response.data.message);
      else toast.error(err.message);
    }
  };

  const softDeleteDoc = async (id: string) => {
    set_error(false);
    try {
      const { data } = await api.put(`/delete/${id}`, {});
      setDocs((prev) => prev.map((n) => (n.id === id ? data.data : n)));
      toast.success(data.message);
    } catch (err: any) {
      set_error(true);
      if (err.response) toast.error(err.response.data.message);
      else toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return {
    docs,
    fetchDocs,
    createDoc,
    updateDoc,
    deleteDoc,
    softDeleteDoc,
    error,
    set_error,
  };
}
