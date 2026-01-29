import Image from 'next/image';

const imageUrl = [
  'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769499495/positive-excited-charming-redhead-woman-yellow-sweater-showing-smartphone-screen-advertise_babwou.jpg',
'https://res.cloudinary.com/dstnwi5iq/image/upload/v1769499495/positive-excited-charming-redhead-woman-yellow-sweater-showing-smartphone-screen-advertise_babwou.jpg'
];

export default function Banner() {
  return (
    <section className="w-full bg-white">
      <div className="grid grid-cols-2 gap-4 px-20 py-10">
        {imageUrl.map((url, i) => (
          <div key={i}>
            <Image
              src={url}
              alt={`Banner ${i + 1}`}
              width={400}
              height={200}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
              sizes="50vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
