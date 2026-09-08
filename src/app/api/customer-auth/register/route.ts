import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface CustomerPayload {
  credential?: string;
}

interface GoogleProfile {
  name?: string;
  email?: string;
  picture?: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CustomerPayload;
    const googleProfile = payload.credential ? decodeGoogleCredential(payload.credential) : null;

    if (!googleProfile) {
      return NextResponse.json(
        { message: 'Khách hàng chỉ được đăng nhập bằng Google' },
        { status: 400 }
      );
    }

    const customer = {
      fullname: (googleProfile.name || '').trim(),
      email: (googleProfile.email || '').trim().toLowerCase(),
      avatarUrl: googleProfile.picture || '',
      provider: 'google',
      registeredAt: new Date().toISOString(),
    };

    if (!customer.fullname || !customer.email) {
      return NextResponse.json(
        { message: 'Google không trả về đủ tên và email khách hàng' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(
      'customer_profile',
      Buffer.from(JSON.stringify(customer)).toString('base64url'),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      }
    );

    return NextResponse.json({ customer });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không đăng ký được khách hàng';
    return NextResponse.json({ message }, { status: 500 });
  }
}

function decodeGoogleCredential(credential: string): GoogleProfile | null {
  const [, payload] = credential.split('.');
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as GoogleProfile;
  } catch {
    return null;
  }
}
