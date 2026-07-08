import LogoutButton from './LogoutButton';

export default function UsersPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-black text-white p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-md">
        <LogoutButton />
      </div>
    </div>
  );
}
