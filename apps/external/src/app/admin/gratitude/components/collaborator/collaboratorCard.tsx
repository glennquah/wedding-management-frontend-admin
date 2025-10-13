interface CollaboratorCardProps {
  message: string;
  signOff: string;
  photoUrl: string;
  selectedWeddingDate: string;
}

export const CollaboratorCard = ({
  message,
  signOff,
  photoUrl,
  selectedWeddingDate,
}: CollaboratorCardProps) => {
  return (
    <div className="relative flex w-[620px] h-[500px] items-start justify-center">
      <div className="relative w-full max-w-[900px] rounded-xl shadow-lg overflow-hidden bg-white border border-transparent">
        <div className="relative z-10 flex flex-col items-center text-center px-10 py-10 sm:py-12">
          {/* Small gold heart */}
          <svg
            className="w-7 h-7 mb-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20s-6.5-4.35-9-6.75C-0.12 9.98 2.3 5 6.5 5 8.64 5 10 6.6 12 8.6 14 6.6 15.36 5 17.5 5 21.7 5 24.12 9.98 21 13.25 18.5 15.65 12 20 12 20z"
              fill="#c9a24a"
            />
          </svg>

          {photoUrl && (
            <div className="w-[120px] h-[120px] mb-6 rounded-full overflow-hidden border-2 border-[#c9a24a]">
              <img src={photoUrl} alt="Collaborator" className="object-cover w-full h-full" />
            </div>
          )}

          <h1 className="font-script text-[56px] sm:text-[72px] leading-[0.9] -mb-1">Thank you!</h1>

          <div className="w-16 h-[2px] bg-gray-600/60 my-6" />

          <p className="font-serif text-[16px] sm:text-[18px] tracking-[0.36em] leading-[1.8] text-gray-800 max-w-[720px] whitespace-pre-line">
            {message}
          </p>
          <p className="font-serif uppercase tracking-widest mt-8 text-[20px] sm:text-[22px]">
            {signOff}
          </p>
          <p className="font-script text-[20px] mt-2 text-gold">Love you</p>
          <span className="text-xs text-gray-500 uppercase mt-2">
            {new Date(selectedWeddingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;600;700&display=swap');

        .font-script {
          font-family: 'Great Vibes', cursive;
        }

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .text-gold {
          color: #c9a24a;
        }

        .shadow-lg {
          box-shadow: 0 4px 18px rgba(10, 10, 10, 0.06);
        }

        @media (max-width: 640px) {
          .font-script {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};
