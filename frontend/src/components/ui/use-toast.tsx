import { useState, useEffect } from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5000; // 5 seconds

let count = 0;

function genId(): string {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}

type ToastVariant = "default" | "destructive";

interface ToastProps {
    id?: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

interface ToastState {
    toasts: ToastProps[];
}

type ToastAction =
    | { type: "ADD_TOAST"; toast: ToastProps }
    | { type: "UPDATE_TOAST"; toast: ToastProps }
    | { type: "DISMISS_TOAST"; toastId?: string }
    | { type: "REMOVE_TOAST"; toastId?: string };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: ToastState, action: ToastAction): ToastState => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case "DISMISS_TOAST": {
            const { toastId } = action;

            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => {
                    if (toast.id) {
                        addToRemoveQueue(toast.id);
                    }
                });
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            open: false,
                        }
                        : t
                ),
            };
        }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
    }
};

const listeners: Array<(state: ToastState) => void> = [];

let memoryState: ToastState = { toasts: [] };

function dispatch(action: ToastAction) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

interface ToastReturn {
    id: string;
    dismiss: () => void;
    update: (props: ToastProps) => void;
}

function toast(props: ToastProps): ToastReturn {
    const id = genId();

    const update = (props: ToastProps) =>
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
        });

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open: boolean) => {
                if (!open) dismiss();
            },
        },
    });

    // Auto dismiss based on duration
    if (props.duration && props.duration !== Infinity) {
        setTimeout(() => {
            dismiss();
        }, props.duration);
    }

    return {
        id: id,
        dismiss,
        update,
    };
}

interface UseToastReturn extends ToastState {
    toast: (props: ToastProps) => ToastReturn;
    dismiss: (toastId?: string) => void;
}

function useToast(): UseToastReturn {
    const [state, setState] = useState<ToastState>(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    };
}

export { useToast, toast };
export type { ToastProps, ToastVariant };