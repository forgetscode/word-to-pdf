import { NextResponse } from 'next/server';
import libre from 'libreoffice-convert';
import fs from 'fs';
import { promisify } from 'util';
const convertAsync = promisify(libre.convert);

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfBuffer = await convertAsync(buffer, '.pdf', undefined);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=converted.pdf'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Conversion failed. Make sure LibreOffice is installed.' },
      { status: 500 }
    );
  }
}