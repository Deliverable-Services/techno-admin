import React from 'react';
import { Button } from 'react-bootstrap';

interface FlyoutProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
    showOverlay?: boolean;
    closeOnOverlayClick?: boolean;
    showFooter?: boolean;
    cancelText?: string;
}

const Flyout: React.FC<FlyoutProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = '500px',
    showOverlay = true,
    closeOnOverlayClick = true,
    showFooter = true,
    cancelText = 'Cancel'
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="position-fixed top-0 end-0 h-100 bg-white shadow-lg flyout-panel"
                style={{
                    width,
                }}
            >
                <div className='d-flex flex-column h-100 justify-content-between'>
                    <div className='d-flex flex-column'>
                        <div className="d-flex justify-content-between align-items-center border-bottom flyout-header">
                            <h5 className="mb-0">{title}</h5>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={onClose}
                                style={{ border: 'none', fontSize: '1.5rem', lineHeight: '1' }}
                            >
                                ×
                            </Button>
                        </div>

                        <div
                            className="p-3 flyout-content"
                            style={{
                                height: 'calc(100vh - 113px)',
                                overflowY: 'auto'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                    {showFooter && (
                        <div className="border-top flyout-footer p-3">
                            <div className="d-flex justify-content-end align-items-center">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={onClose}
                                >
                                    {cancelText}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showOverlay && (
                <div
                    className="position-fixed start-0 w-100 h-100 bg-dark"
                    style={{
                        opacity: 0.5,
                        zIndex: 9998,
                        inset: 0
                    }}
                    onClick={closeOnOverlayClick ? onClose : undefined}
                />
            )}
        </>
    );
};

export default Flyout;
