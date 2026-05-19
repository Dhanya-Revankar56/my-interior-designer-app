import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// Lightweight Firestore-powered collaboration: room state, presence, chat.
export function useRoomCollaboration(roomId, user) {
  const [furnitureLayout, setFurnitureLayout] = useState([]);
  const [presence, setPresence] = useState({});
  const [messages, setMessages] = useState([]);

  // Ensure room doc exists
  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    getDoc(roomRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(
          roomRef,
          {
            name: `Room ${roomId}`,
            furnitureLayout: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            version: 1
          },
          { merge: true }
        ).catch((err) => console.error('Failed to create room doc', err));
      }
    });
  }, [roomId]);

  // Room live data
  useEffect(() => {
    if (!roomId) return undefined;
    const unsub = onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      const data = snap.data();
      if (data?.furnitureLayout) {
        setFurnitureLayout(data.furnitureLayout);
      }
    });
    return () => unsub();
  }, [roomId]);

  // Presence live data
  useEffect(() => {
    if (!roomId) return undefined;
    const presRef = collection(db, 'rooms', roomId, 'presence');
    const unsub = onSnapshot(presRef, (snap) => {
      const next = {};
      snap.forEach((d) => {
        next[d.id] = d.data();
      });
      setPresence(next);
    });
    return () => unsub();
  }, [roomId]);

  // Chat live data
  useEffect(() => {
    if (!roomId) return undefined;
    const msgsRef = collection(db, 'rooms', roomId, 'messages');
    const unsub = onSnapshot(msgsRef, (snap) => {
      const items = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
      items.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setMessages(items);
    });
    return () => unsub();
  }, [roomId]);

  // Presence heartbeat
  useEffect(() => {
    if (!roomId || !user) return undefined;
    const presRef = doc(db, 'rooms', roomId, 'presence', user.uid);
    const intervalId = setInterval(() => {
      setDoc(
        presRef,
        {
          displayName: user.displayName || 'Guest',
          avatar: user.photoURL || '',
          isActive: true,
          lastSeen: serverTimestamp()
        },
        { merge: true }
      ).catch((err) => console.error('Presence update failed', err));
    }, 20000);

    // Immediately set presence on mount
    setDoc(
      presRef,
      {
        displayName: user.displayName || 'Guest',
        avatar: user.photoURL || '',
        isActive: true,
        lastSeen: serverTimestamp()
      },
      { merge: true }
    ).catch((err) => console.error('Initial presence failed', err));

    return () => clearInterval(intervalId);
  }, [roomId, user]);

  const updateFurniture = useCallback(
    async (nextLayout) => {
      if (!roomId) return;
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        furnitureLayout: nextLayout,
        updatedAt: serverTimestamp()
      });
    },
    [roomId]
  );

  const sendMessage = useCallback(
    async (text) => {
      if (!roomId || !text) return;
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: text.trim(),
        userId: user?.uid || 'anon',
        userName: user?.displayName || 'Guest',
        createdAt: serverTimestamp()
      });
    },
    [roomId, user]
  );

  return { furnitureLayout, presence, messages, updateFurniture, sendMessage };
}

export default useRoomCollaboration;




