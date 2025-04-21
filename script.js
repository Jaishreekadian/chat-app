// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCpN3sb8BAADGiAS09UnhuMXgKcQguIVZ4",
  authDomain: "chat-application-b444e.firebaseapp.com",
  projectId: "chat-application-b444e",
  storageBucket: "chat-application-b444e.firebasestorage.app",
  messagingSenderId: "217376164356",
  appId: "1:217376164356:web:5e404d9849cff494180351",
  measurementId: "G-XT1EW6N4M0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authSection = document.getElementById("authSection");
const chatSection = document.getElementById("chatSection");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const userEmail = document.getElementById("userEmail");
const authMessage = document.getElementById("authMessage");

// Register
window.register = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    authMessage.textContent = "Registration successful!";
  } catch (error) {
    authMessage.textContent = error.message;
  }
};

// Login
window.login = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    authMessage.textContent = error.message;
  }
};

// Logout
window.logout = async () => {
  await signOut(auth);
};

// Send Message
window.sendMessage = async () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  await addDoc(collection(db, "messages"), {
    text: msg,
    email: auth.currentUser.email,
    timestamp: serverTimestamp()
  });

  messageInput.value = "";
};

// Listen for auth state change
onAuthStateChanged(auth, user => {
  if (user) {
    authSection.classList.add("hidden");
    chatSection.classList.remove("hidden");
    userEmail.textContent = user.email;
    listenForMessages();
  } else {
    authSection.classList.remove("hidden");
    chatSection.classList.add("hidden");
  }
});

// Real-time message listener
function listenForMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const msgDiv = document.createElement("div");
      msgDiv.className = "message";
      msgDiv.textContent = `${data.email}: ${data.text}`;
      chatBox.appendChild(msgDiv);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
