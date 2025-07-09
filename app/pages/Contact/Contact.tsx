import "./contact.css";

export default function Contact() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <p>Contact Information</p>
          </div>
        </header>
        <div className="w-full max-w-[300px] space-y-6 px-4"></div>
      </div>
    </main>
  );
}
