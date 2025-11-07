import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Flatlist, TouchableOpacity, StyleSheeeet, Alert } from "react-native";
import {  } from "../utils/storage";
import { resetNotes } from "../utils/db";

export default function NoteScreen() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useSstate([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        //initialize notes
        //get notes
      } catch (e) {
        console.warn("DB init/load error", e);
        Alert.alert("Database error", String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadNotes = async () => {
    const rows = await fetchNotes();  
    setNotes(rows || []);
  };

  const onAdd = async () => {
    const trimmed = note.trim();
    if (!trimmed) {
      Alert.alert("Empty note", "Type something first, please");
      return;

    } try {
      await insertNote(trimmed);
      setNote("");
      await loadNotes();
    } catch (e) {
      console.warn("Error inserting or loading");
    }
  };
}

const onDelete = async (id) => {
  try {
    await removeNote(id);
    await loadNotes();
  } catch (e) {
    console.warn("Error inserting or loading");
  }
}

const onReset = async (id) => {
  try {
    await resetNotes(id);
    await loadNotes();
  } catch (e) {
    console.warn("Error inserting or loading");
  }
}