'use client'

import { Loader2 } from 'lucide-react' // ou outro ícone de loading que preferir

export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
    )
}
