import {
  Html, Head, Body, Container, Section, Row, Column,
  Text, Hr, Preview, Font, Img,
} from '@react-email/components'

type LineItem = { label: string; price: number }

type Props = {
  customerName: string
  serviceType: string
  jobDetails: string
  address?: string
  date?: string
  lineItems: LineItem[]
  customMessage?: string
  referenceId: string
  companyName?: string
  companyTagline?: string
  footerMessage?: string
  headerImageUrl?: string | null
}

const brand = {
  dark: '#1a2e35',
  teal: '#8cc7c4',
  light: '#f4f6f8',
  muted: '#718096',
  border: '#dde3ea',
}

export function BookingConfirmationEmail({
  customerName,
  serviceType,
  jobDetails,
  address,
  date,
  lineItems,
  customMessage,
  referenceId,
  companyName = 'EasyWay',
  companyTagline = 'Home Services',
  footerMessage = 'Questions? Reply to this email or call us directly. Our team is happy to help.',
  headerImageUrl,
}: Props) {
  const total = lineItems.reduce((s, l) => s + l.price, 0)
  const hasReceipt = lineItems.length > 0

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Playfair Display"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtA.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your {companyName} booking is confirmed — Ref #{referenceId}</Preview>

      <Body style={{ backgroundColor: brand.light, fontFamily: 'DM Sans, Helvetica, Arial, sans-serif', margin: 0, padding: '40px 0' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto' }}>

          {/* Header image (optional) */}
          {headerImageUrl && (
            <Section style={{ borderRadius: '12px 12px 0 0', overflow: 'hidden', margin: 0, padding: 0 }}>
              <Img
                src={headerImageUrl}
                alt={companyName}
                width="560"
                style={{ display: 'block', width: '100%', borderRadius: '12px 12px 0 0' }}
              />
            </Section>
          )}

          {/* Header */}
          <Section style={{
            backgroundColor: brand.dark,
            borderRadius: headerImageUrl ? '0' : '12px 12px 0 0',
            padding: '32px 40px 28px',
          }}>
            <Text style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 26, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>
              {companyName}
            </Text>
            <Text style={{ fontSize: 12, color: brand.teal, margin: '6px 0 0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {companyTagline}
            </Text>
          </Section>

          {/* Teal accent bar */}
          <Section style={{ backgroundColor: brand.teal, height: 4, padding: 0, margin: 0 }}>
            <Text style={{ margin: 0, fontSize: 0 }}>&nbsp;</Text>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: '#fff', padding: '36px 40px' }}>
            <Text style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, fontWeight: 700, color: brand.dark, margin: '0 0 6px' }}>
              Your booking is confirmed ✓
            </Text>
            <Text style={{ fontSize: 14, color: brand.muted, margin: '0 0 28px', lineHeight: 1.6 }}>
              Hi {customerName}, thanks for choosing {companyName}. Here's a summary of your booking.
            </Text>

            {customMessage && (
              <Section style={{ backgroundColor: brand.light, borderLeft: `3px solid ${brand.teal}`, borderRadius: 4, padding: '12px 16px', marginBottom: 24 }}>
                <Text style={{ fontSize: 13, color: brand.dark, margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {customMessage}
                </Text>
              </Section>
            )}

            {/* Booking details */}
            <Text style={{ fontSize: 11, fontWeight: 700, color: brand.muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Booking Details
            </Text>
            <Section style={{ backgroundColor: brand.light, borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
              <Row style={{ marginBottom: 8 }}>
                <Column style={{ width: '40%' }}>
                  <Text style={{ fontSize: 11, color: brand.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Service</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 13, color: brand.dark, fontWeight: 600, margin: 0 }}>{serviceType}</Text>
                </Column>
              </Row>
              {address && (
                <Row style={{ marginBottom: 8 }}>
                  <Column style={{ width: '40%' }}>
                    <Text style={{ fontSize: 11, color: brand.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location</Text>
                  </Column>
                  <Column>
                    <Text style={{ fontSize: 13, color: brand.dark, margin: 0 }}>{address}</Text>
                  </Column>
                </Row>
              )}
              {date && (
                <Row style={{ marginBottom: 8 }}>
                  <Column style={{ width: '40%' }}>
                    <Text style={{ fontSize: 11, color: brand.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</Text>
                  </Column>
                  <Column>
                    <Text style={{ fontSize: 13, color: brand.dark, margin: 0 }}>{date}</Text>
                  </Column>
                </Row>
              )}
              <Row>
                <Column style={{ width: '40%' }}>
                  <Text style={{ fontSize: 11, color: brand.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Details</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: 13, color: brand.dark, margin: 0, lineHeight: 1.6 }}>{jobDetails}</Text>
                </Column>
              </Row>
            </Section>

            {/* Receipt */}
            {hasReceipt && (
              <>
                <Text style={{ fontSize: 11, fontWeight: 700, color: brand.muted, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  Price Breakdown
                </Text>
                <Section style={{ border: `1px solid ${brand.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
                  {lineItems.map((item, i) => (
                    <Row key={i} style={{ borderBottom: i < lineItems.length - 1 ? `1px solid ${brand.border}` : 'none', padding: '10px 20px' }}>
                      <Column>
                        <Text style={{ fontSize: 13, color: '#4a5568', margin: 0 }}>{item.label}</Text>
                      </Column>
                      <Column style={{ textAlign: 'right' }}>
                        <Text style={{ fontSize: 13, color: brand.dark, fontWeight: 600, margin: 0 }}>${item.price}</Text>
                      </Column>
                    </Row>
                  ))}
                  <Row style={{ backgroundColor: brand.light, padding: '12px 20px' }}>
                    <Column>
                      <Text style={{ fontSize: 14, fontWeight: 700, color: brand.dark, margin: 0 }}>Total</Text>
                    </Column>
                    <Column style={{ textAlign: 'right' }}>
                      <Text style={{ fontSize: 16, fontWeight: 700, color: brand.teal, margin: 0 }}>${total}</Text>
                    </Column>
                  </Row>
                </Section>
              </>
            )}

            <Text style={{ fontSize: 11, color: brand.muted, margin: '0 0 4px' }}>
              Reference: <span style={{ fontWeight: 600, color: brand.dark }}>#{referenceId}</span>
            </Text>

            <Hr style={{ borderColor: brand.border, margin: '24px 0' }} />

            <Text style={{ fontSize: 12, color: brand.muted, lineHeight: 1.7, margin: 0 }}>
              {footerMessage}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: brand.dark, borderRadius: '0 0 12px 12px', padding: '20px 40px' }}>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, textAlign: 'center' }}>
              © {new Date().getFullYear()} {companyName} · All rights reserved
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}