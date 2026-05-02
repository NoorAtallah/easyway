import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const zip1 = searchParams.get('zip1')
  const zip2 = searchParams.get('zip2')
  const type = searchParams.get('type') // 'info' | 'distance'

  const key = process.env.ZIPCODEAPI_KEY

  let url = ''
  if (type === 'info' && zip1) {
    url = `https://www.zipcodeapi.com/rest/${key}/info.json/${zip1}/degrees`
  } else if (type === 'distance' && zip1 && zip2) {
    url = `https://www.zipcodeapi.com/rest/${key}/distance.json/${zip1}/${zip2}/mile`
  } else {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const res = await fetch(url)
  const data = await res.json()
  return NextResponse.json(data)
}