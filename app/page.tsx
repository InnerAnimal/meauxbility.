export default function Home() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            color: '#0C2D31',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          More Options. More Access.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #339999 0%, #237373 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            More Life.
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            lineHeight: 1.7,
            color: '#0C2D31',
            marginBottom: '2.5rem',
            maxWidth: '800px',
            margin: '0 auto 2.5rem',
          }}
        >
          Meauxbility is a 501(c)(3) nonprofit organization providing mobility grants and accessibility services
          to spinal cord injury survivors across Louisiana's Acadiana region.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/donmichael-campaign"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1.125rem',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #FF6B35 0%, #E85D00 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            Support DonMichael's Campaign
          </a>

          <a
            href="/about"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1.125rem',
              textDecoration: 'none',
              background: 'transparent',
              color: '#339999',
              border: '2px solid #339999',
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            Learn Our Story
          </a>
        </div>

        <div
          style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'rgba(51,153,153,0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(51,153,153,0.2)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              color: '#0C2D31',
              marginBottom: '1rem',
            }}
          >
            Our Mission
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: '#0C2D31',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            We transform obstacles into pathways by providing adaptive equipment, mobility grants, and comprehensive
            support services for individuals living with spinal cord injuries.
          </p>
        </div>

        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem',
            background: '#FFF9F5',
            borderRadius: '12px',
            border: '2px solid #FF6B35',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#E85D00',
              margin: 0,
            }}
          >
            🚀 Next.js Migration Complete! This is your new Meauxbility homepage powered by Next.js 14, Vercel, and
            your beautiful footer design.
          </p>
        </div>
      </div>
    </div>
  );
}
