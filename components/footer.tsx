export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Vibes-check. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
