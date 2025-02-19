export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container">
        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} Vibes-check. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
