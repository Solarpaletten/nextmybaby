import Link from 'next/link';

export default function VatPage() {
  return (
    <main
      style={{
        padding: '40px 24px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/"
            style={{
              color: '#6366f1',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            ← Назад к главной
          </Link>
        </div>

        <h1
          style={{
            color: '#1e293b',
            marginBottom: '8px',
            fontSize: '2rem',
            fontWeight: '700',
          }}
        >
          📊 VAT System Module
        </h1>

        <p
          style={{
            color: '#64748b',
            marginBottom: '32px',
            fontSize: '1.1rem',
          }}
        >
          Пустая страница готова для подключения дашборда бухгалтерии.
        </p>

        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3 style={{ color: '#065f46', marginBottom: '12px' }}>
            📋 Следующие шаги:
          </h3>
          <ol style={{ color: '#065f46', paddingLeft: '20px' }}>
            <li>
              Создать адаптер в <code>components/legacy/vat/</code>
            </li>
            <li>Перенести HTML страницу в TSX формат</li>
            <li>Добавить интерактивность</li>
            <li>Подключить к этой странице</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
