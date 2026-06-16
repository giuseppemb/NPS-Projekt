"use client";

import { useEffect, useState } from "react";

export default function NpsResponse() {
    const [message, setMessage] = useState("Saving your feedback...");

    useEffect(() => {
        const saveResponse = async () => {
            const params = new URLSearchParams(window.location.search);

            const deal = params.get("deal");
            const contact = params.get("contact");
            const question = params.get("question");
            const answer = params.get("answer");
            const dealname = params.get("dealname");

            try {
                const response = await fetch("/api/nps", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        deal,
                        contact,
                        question,
                        answer,
                        dealname
                    })
                });

                const data = await response.json();

                if (data.alreadyAnswered) {
                    setMessage("You have already submitted your feedback.");
                    return;
                }

                setMessage("Thank you for your feedback!");
            } catch (error) {
                setMessage("An error occurred.");
            }
        };

        saveResponse();
    }, []);

    return (
        <main
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                fontFamily: "Arial"
            }}
        >
            <h1>{message}</h1>
        </main>
    );
}