import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-white/10 hover:bg-white/20',
            card: 'bg-zinc-900/50 backdrop-blur-xl border border-white/10',
            headerTitle: 'text-white',
            headerSubtitle: 'text-white/60',
            socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 border-white/10',
            socialButtonsBlockButtonText: 'text-white',
            formFieldLabel: 'text-white/60',
            formFieldInput: 'bg-zinc-800/50 border-white/10 text-white',
            footerActionLink: 'text-white hover:text-white/80',
            identityPreviewText: 'text-white',
            formFieldInputShowPasswordButton: 'text-white/60 hover:text-white',
          },
        }}
      />
    </div>
  );
}
