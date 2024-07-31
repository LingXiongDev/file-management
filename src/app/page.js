import FileManagement from './file-management';
import Message from './components/message';

export default function Home() {
  return (
    <main className="min-h-screen">
      <FileManagement />
      <Message />
    </main>
  );
}
