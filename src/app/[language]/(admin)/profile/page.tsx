import { userService } from '@/services/user.service';
import { redirect } from 'next/navigation';
import LogoutButton from '../users/LogoutButton';
import { ResUserDTO, UserLogin } from '@/types';
import Navbar from '@/components/navbar/Navbar';
import { getDictionary } from '@/utils/i18n';

interface PageProps {
  params: Promise<{ language: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { language } = await params;
  const dict = getDictionary(language).profile;

  let profile: ResUserDTO;
  try {
    profile = await userService.getMyProfile();
  } catch (error) {
    console.error('Error loading profile page:', error);
    // If not authenticated or error, redirect to login
    redirect(`/${language}/login`);
  }

  const navbarUser: UserLogin = {
    id: profile.id,
    fullname: profile.fullname,
    email: profile.email,
    role: profile.role ? { id: profile.role.id, name: profile.role.name, permissions: [] } : null,
    employeeCode: profile.employeeCode || undefined,
    avatarUrl: profile.avatarUrl || undefined,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={navbarUser} />
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-md text-gray-900">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">{dict.title}</h1>

          <div className="space-y-4 mb-6">
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.employee_code}
              </span>
              <span className="text-lg font-medium text-gray-900">
                {profile.employeeCode || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.fullname}
              </span>
              <span className="text-lg font-medium text-gray-900">{profile.fullname}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.email}
              </span>
              <span className="text-lg font-medium text-gray-900">{profile.email}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.phone}
              </span>
              <span className="text-lg font-medium text-gray-900">{profile.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.role}
              </span>
              <span className="text-lg font-medium text-gray-900">
                {profile.role?.name || 'N/A'}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dict.status}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {profile.status}
              </span>
            </div>
          </div>

          <LogoutButton label={dict.logout} />
        </div>
      </div>
    </div>
  );
}
