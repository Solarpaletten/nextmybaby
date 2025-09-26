import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        padding: '40px 24px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            color: '#1e293b',
            marginBottom: '8px',
            fontSize: '2.5rem',
            fontWeight: '700',
          }}
        >
          Dashka • Next.js Core
        </h1>
        <p
          style={{
            color: '#64748b',
            marginBottom: '32px',
            fontSize: '1.1rem',
          }}
        >
          Чистое ядро Next.js готово. Теперь дозированно добавляем
          продукт-модули.
        </p>

        <div
          style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          }}
        >
          <div
            style={{
              padding: '20px',
              background: '#f1f5f9',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ color: '#475569', marginBottom: '12px' }}>
              🔍 System Health
            </h3>
            <Link
              href="/api/health"
              target="_blank"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              /api/health →
            </Link>
          </div>

          <div
            style={{
              padding: '20px',
              background: '#f1f5f9',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ color: '#475569', marginBottom: '12px' }}>
              🔄 Echo API
            </h3>
            <Link
              href="/api/echo"
              target="_blank"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              /api/echo →
            </Link>
          </div>

          <div
            style={{
              padding: '20px',
              background: '#fef3c7',
              borderRadius: '12px',
              border: '1px solid #fcd34d',
            }}
          >
            <h3 style={{ color: '#92400e', marginBottom: '12px' }}>
              🌐 Translator
            </h3>
            <Link
              href="/translator"
              style={{
                color: '#d97706',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              /translator →
            </Link>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#92400e',
                marginTop: '8px',
                margin: 0,
              }}
            >
              Готов для модулей
            </p>
          </div>

          <div
            style={{
              padding: '20px',
              background: '#ecfdf5',
              borderRadius: '12px',
              border: '1px solid #6ee7b7',
            }}
          >
            <h3 style={{ color: '#065f46', marginBottom: '12px' }}>
              📊 VAT System
            </h3>
            <Link
              href="/vat"
              style={{
                color: '#059669',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              /vat →
            </Link>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#065f46',
                marginTop: '8px',
                margin: 0,
              }}
            >
              Готов для модулей
            </p>
          </div>
          <div
            style={{
              padding: '20px',
              background: '#fdf2f8',
              borderRadius: '12px',
              border: '1px solid #f9a8d4',
            }}
          >
            <h3 style={{ color: '#9d174d', marginBottom: '12px' }}>
              👶 My Baby
            </h3>
            <Link
              href="/mybaby"
              style={{
                color: '#be185d',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              /mybaby →
            </Link>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#9d174d',
                marginTop: '8px',
                margin: 0,
              }}
            >
              Новый модуль для малыша
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
