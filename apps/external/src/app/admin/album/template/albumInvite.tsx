import Image from 'next/image';

interface InviteCardProps {
  coupleName1: string;
  coupleName2: string;
  inviteMessage: string;
  qrCodeUrl: string;
}

export default function InviteCard({
  coupleName1,
  coupleName2,
  inviteMessage,
  qrCodeUrl,
}: InviteCardProps) {
  return (
    <div
      className="relative w-[400px] h-[500px] bg-white p-6 flex flex-col justify-between border-2 border-rose-200 rounded-3xl shadow-xl mx-auto"
      style={{
        fontFamily: "'Didot', 'Playfair Display', serif",
      }}
    >
      {/* Top Section - Names */}
      <div className="mt-3 text-center">
        <h1 className="text-4xl font-light tracking-wide text-gray-750">{coupleName1}</h1>
        <p className="text-sm mt-1 text-gray-500">and</p>
        <h1 className="text-4xl font-light tracking-wide text-gray-700">{coupleName2}</h1>
      </div>

      {/* Middle Section - Message */}
      <div className="mt-4">
        <p className="text-left text-base leading-relaxed max-w-[340px] text-gray-700 italic border-l-2 border-rose-200 pl-6 py-2 ml-2">
          {inviteMessage}
        </p>
      </div>

      {/* Bottom Section - QR */}
      <div className="flex flex-col items-center">
        <div className="p-2 border-2 border-rose-200 rounded-xl shadow-md mt-4">
          <Image src={qrCodeUrl} alt="QR Code" width={100} height={100} />
        </div>
        <p className="text-xs text-gray-500 mt-1 italic">knotly</p>
      </div>

      {/* Decorative Corner Flourish */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-rose-200"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-rose-200"></div>
    </div>
  );
}
