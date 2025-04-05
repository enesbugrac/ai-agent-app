"use client";

import { useEffect, useState } from "react";
import { useModalStore } from "@/store/modalStore";
import { IoClose } from "react-icons/io5";

const Modal = () => {
  const { isOpen, content, closeModal } = useModalStore();
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      setTimeout(() => setShowBackdrop(true), 10);
      setTimeout(() => setShowModal(true), 50);
    } else {
      setShowBackdrop(false);
      setShowModal(false);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    setShowBackdrop(false);

    setTimeout(() => {
      closeModal();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200 ease-in-out ${
          showBackdrop ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div
          className={`w-full max-w-lg transition-all duration-200 ease-in-out ${
            showModal
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <div className="bg-background border border-border rounded-lg shadow-xl overflow-hidden">
            <button
              onClick={handleClose}
              className="text-secondary hover:text-primary transition-colors absolute top-2 right-2"
            >
              <IoClose className="text-xl" />
            </button>
            <div className="p-4">{content}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
