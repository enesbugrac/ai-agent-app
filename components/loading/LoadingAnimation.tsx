import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import React from 'react'
import Logo from '../Logo';

function LoadingAnimation() {
    return (
        <AnimatePresence>
            <motion.div
                key="loading"
                initial={{ opacity: 1, height: "100vh" }}
                exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                        height: { duration: 0.8, ease: [0.76, 0.17, 0.13, 0.85] },
                        opacity: { duration: 0.3, delay: 0.5 },
                    },
                }}
                className="fixed inset-0 z-50 bg-[#13151a] flex flex-col items-center justify-center overflow-hidden"
            >
                <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="logo flex items-center gap-2"
                    >
                        <h1 className="text-primary font-syne text-6xl font-bold">AIGEN</h1>
                        <Logo withText={false} width={100} height={100} />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-secondary text-sm"
                    >
                        AI Powered Task Force
                    </motion.span>
                </div>

                <motion.div
                    className="w-full h-[30px]"
                    id="progress-bar"
                    exit={{
                        opacity: 0,
                        y: -20,
                        transition: { duration: 0.3 },
                    }}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: [0.76, 0.17, 0.13, 0.85] }}
                        className="h-full bg-primary"
                    />
                </motion.div>
            </motion.div>

        </AnimatePresence>
    )
}

export default LoadingAnimation