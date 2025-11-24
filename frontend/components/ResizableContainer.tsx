import React, { useState, useRef, useEffect } from 'react';

interface ResizableContainerProps {
    children: React.ReactNode;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    defaultWidth?: number;
    defaultHeight?: number;
}

export const ResizableContainer: React.FC<ResizableContainerProps> = ({
    children,
    minWidth = 375,
    minHeight = 477,
    maxWidth = 1200,
    maxHeight = 830,
    defaultWidth = 428,
    defaultHeight = 726,
}) => {
    const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 0, height: 0 });

    const handleMouseDown = (direction: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        setResizeDirection(direction);
        startPos.current = { x: e.clientX, y: e.clientY };
        startSize.current = { ...size };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startPos.current.x;
            const deltaY = e.clientY - startPos.current.y;

            let newWidth = startSize.current.width;
            let newHeight = startSize.current.height;

            if (resizeDirection.includes('e')) {
                newWidth = Math.max(minWidth, Math.min(maxWidth, startSize.current.width + deltaX));
            }
            if (resizeDirection.includes('w')) {
                newWidth = Math.max(minWidth, Math.min(maxWidth, startSize.current.width - deltaX));
            }
            if (resizeDirection.includes('s')) {
                newHeight = Math.max(minHeight, Math.min(maxHeight, startSize.current.height + deltaY));
            }
            if (resizeDirection.includes('n')) {
                newHeight = Math.max(minHeight, Math.min(maxHeight, startSize.current.height - deltaY));
            }

            setSize({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeDirection('');
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = getCursor(resizeDirection);
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, resizeDirection, minWidth, minHeight, maxWidth, maxHeight]);

    const getCursor = (direction: string) => {
        const cursors: { [key: string]: string } = {
            n: 'ns-resize',
            s: 'ns-resize',
            e: 'ew-resize',
            w: 'ew-resize',
            ne: 'nesw-resize',
            nw: 'nwse-resize',
            se: 'nwse-resize',
            sw: 'nesw-resize',
        };
        return cursors[direction] || 'default';
    };

    const resizeHandleClass = "absolute bg-transparent hover:bg-brand/20 transition-colors z-50";
    const cornerSize = "w-4 h-4";
    const edgeThickness = "4px";

    return (
        <div className="flex items-center justify-center min-h-screen w-full desktop-bg">
            <div
                ref={containerRef}
                className="relative shadow-2xl"
                style={{
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                }}
            >
                {/* Resize Handles - Corners */}
                <div
                    className={`${resizeHandleClass} ${cornerSize} top-0 left-0 cursor-nwse-resize`}
                    onMouseDown={handleMouseDown('nw')}
                />
                <div
                    className={`${resizeHandleClass} ${cornerSize} top-0 right-0 cursor-nesw-resize`}
                    onMouseDown={handleMouseDown('ne')}
                />
                <div
                    className={`${resizeHandleClass} ${cornerSize} bottom-0 left-0 cursor-nesw-resize`}
                    onMouseDown={handleMouseDown('sw')}
                />
                <div
                    className={`${resizeHandleClass} ${cornerSize} bottom-0 right-0 cursor-nwse-resize`}
                    onMouseDown={handleMouseDown('se')}
                />

                {/* Resize Handles - Edges */}
                <div
                    className={`${resizeHandleClass} top-0 left-4 right-4 cursor-ns-resize`}
                    style={{ height: edgeThickness }}
                    onMouseDown={handleMouseDown('n')}
                />
                <div
                    className={`${resizeHandleClass} bottom-0 left-4 right-4 cursor-ns-resize`}
                    style={{ height: edgeThickness }}
                    onMouseDown={handleMouseDown('s')}
                />
                <div
                    className={`${resizeHandleClass} left-0 top-4 bottom-4 cursor-ew-resize`}
                    style={{ width: edgeThickness }}
                    onMouseDown={handleMouseDown('w')}
                />
                <div
                    className={`${resizeHandleClass} right-0 top-4 bottom-4 cursor-ew-resize`}
                    style={{ width: edgeThickness }}
                    onMouseDown={handleMouseDown('e')}
                />

                {/* Content */}
                <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-[40px] overflow-hidden flex flex-col transition-colors duration-300">
                    {children}
                </div>

                {/* Size Indicator (shown while resizing) */}
                {isResizing && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-mono z-50 pointer-events-none">
                        {size.width} × {size.height}
                    </div>
                )}
            </div>
        </div>
    );
};
