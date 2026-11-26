import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  ClassroomClass,
  ClassroomSession,
  EvaluationQuestion,
  StudentRecord,
  TeacherProfile,
} from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    return true;
  }
}

export async function signInTeacherWithGoogle(): Promise<TeacherProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const teacherPath = `teachers/${user.uid}`;
  try {
    const ref = doc(db, 'teachers', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const newTeacher = {
        uid: user.uid,
        name: (user.displayName || 'Guru IPAS').slice(0, 100),
        email: (user.email || 'guru@sekolah.id').slice(0, 160),
        schoolName: 'SD Nusantara',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(ref, newTeacher);
      return {
        uid: user.uid,
        name: newTeacher.name,
        email: newTeacher.email,
        schoolName: newTeacher.schoolName,
      };
    }
    const data = snap.data();
    return {
      uid: user.uid,
      name: String(data.name || user.displayName || 'Guru IPAS'),
      email: String(data.email || user.email || ''),
      schoolName: String(data.schoolName || 'SD Nusantara'),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, teacherPath);
  }
}

export async function signOutTeacher(): Promise<void> {
  await signOut(auth);
}

export function subscribeTeacherAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function fetchTeacherClasses(teacherId: string): Promise<ClassroomClass[]> {
  const path = 'classes';
  try {
    const q = query(collection(db, path), where('teacherId', '==', teacherId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        teacherId: String(data.teacherId),
        name: String(data.name),
        grade: String(data.grade),
        academicYear: String(data.academicYear),
        studentCount: Number(data.studentCount || 0),
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveTeacherClass(cls: ClassroomClass): Promise<void> {
  const path = `classes/${cls.id}`;
  try {
    const ref = doc(db, 'classes', cls.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        name: cls.name.slice(0, 80),
        grade: cls.grade.slice(0, 40),
        academicYear: cls.academicYear.slice(0, 20),
        studentCount: Math.max(0, Math.min(500, Math.floor(cls.studentCount))),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        teacherId: cls.teacherId,
        name: cls.name.slice(0, 80),
        grade: cls.grade.slice(0, 40),
        academicYear: cls.academicYear.slice(0, 20),
        studentCount: Math.max(0, Math.min(500, Math.floor(cls.studentCount))),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTeacherClass(classId: string): Promise<void> {
  const path = `classes/${classId}`;
  try {
    await deleteDoc(doc(db, 'classes', classId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchTeacherStudents(teacherId: string): Promise<StudentRecord[]> {
  const path = 'students';
  try {
    const q = query(collection(db, path), where('teacherId', '==', teacherId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        teacherId: String(data.teacherId),
        classId: String(data.classId),
        nickname: String(data.nickname),
        studentNumber: String(data.studentNumber),
        totalScore: Number(data.totalScore || 0),
        totalStars: Number(data.totalStars || 0),
        level: Number(data.level || 1),
        evaluationAverage: Number(data.evaluationAverage || 0),
        missionsCompleted: Number(data.missionsCompleted || 0),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveTeacherStudent(student: StudentRecord): Promise<void> {
  const path = `students/${student.id}`;
  try {
    await setDoc(doc(db, 'students', student.id), {
      teacherId: student.teacherId,
      classId: student.classId,
      nickname: student.nickname.slice(0, 60),
      studentNumber: student.studentNumber.slice(0, 20),
      totalScore: Math.max(0, Math.floor(student.totalScore)),
      totalStars: Math.max(0, Math.floor(student.totalStars)),
      level: Math.max(1, Math.floor(student.level)),
      evaluationAverage: Math.max(0, Math.min(100, Math.floor(student.evaluationAverage))),
      missionsCompleted: Math.max(0, Math.min(50, Math.floor(student.missionsCompleted))),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchTeacherSessions(teacherId: string): Promise<ClassroomSession[]> {
  const path = 'sessions';
  try {
    const q = query(collection(db, path), where('teacherId', '==', teacherId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        teacherId: String(data.teacherId),
        classId: String(data.classId),
        sessionCode: String(data.sessionCode),
        title: String(data.title),
        mode: data.mode,
        activityType: data.activityType,
        status: data.status,
        currentStep: Number(data.currentStep || 0),
        allowFreeAccess: Boolean(data.allowFreeAccess),
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveTeacherSession(session: ClassroomSession): Promise<void> {
  const path = `sessions/${session.id}`;
  try {
    const ref = doc(db, 'sessions', session.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        title: session.title.slice(0, 120),
        mode: session.mode,
        activityType: session.activityType,
        status: session.status,
        currentStep: Math.max(0, Math.min(100, Math.floor(session.currentStep))),
        allowFreeAccess: Boolean(session.allowFreeAccess),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        teacherId: session.teacherId,
        classId: session.classId,
        sessionCode: session.sessionCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12),
        title: session.title.slice(0, 120),
        mode: session.mode,
        activityType: session.activityType,
        status: session.status,
        currentStep: Math.max(0, Math.min(100, Math.floor(session.currentStep))),
        allowFreeAccess: Boolean(session.allowFreeAccess),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveCustomQuestionToFirestore(
  teacherId: string,
  qItem: EvaluationQuestion,
): Promise<void> {
  const path = `questions/${qItem.id}`;
  try {
    await setDoc(doc(db, 'questions', qItem.id), {
      teacherId,
      type: qItem.type,
      topic: qItem.topic.slice(0, 60),
      prompt: qItem.prompt.slice(0, 400),
      options: (qItem.options || ['Benar', 'Salah']).slice(0, 6).map((o) => o.slice(0, 240)),
      correctAnswer: qItem.correctAnswer.slice(0, 240),
      explanation: qItem.explanation.slice(0, 400),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
