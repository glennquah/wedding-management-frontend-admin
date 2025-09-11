// Error boundaries must be Client Components
'use client';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

const Error = ({ statusCode }: { statusCode: number }) => {
  return (
    <p>
      {statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}
    </p>
  );
};

Error.getInitialProps = ({
  res,
  err,
}: {
  res?: { statusCode: number };
  err?: { statusCode: number };
}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
