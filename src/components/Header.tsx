export function Header({ title }: { title: string }) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-8">
            <div className="flex items-center">
                <h1 className="text-lg font-bold uppercase tracking-wide text-text-primary drop-shadow-sm">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                {/* Additional header items if necessary */}
            </div>
        </header>
    );
}
