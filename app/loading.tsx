export default function LoadingPage() {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-[#020817]/70 backdrop-blur-sm">
            <div className="loader"></div>
        </div>
    );
}