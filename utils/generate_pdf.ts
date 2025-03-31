import toast from "react-hot-toast";

let isGenerating = false;

export const generatePdf = (path: string) => {
  if (isGenerating) return;
  isGenerating = true;

  toast.promise(
    fetch(`/api/generate-pdf?path=${encodeURIComponent(path)}`)
      .then(async (response) => {
        if (response.ok) {
          return response.blob();
        } else {
          // Try to read error details from response
          // For API errors, first try to parse as JSON
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                errorData.error ||
                `Failed to generate PDF (${response.status})`
            );
          } else {
            // If not JSON, try to get the text content
            const errorText = await response.text().catch(() => null);
            throw new Error(
              errorText ||
                `Failed to generate PDF (${response.status}: ${response.statusText})`
            );
          }
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "timesheet.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Revoke the object URL after the download
        window.URL.revokeObjectURL(url);

        return "PDF downloaded successfully";
      })
      .catch((error) => {
        // Log detailed error for debugging
        console.error("PDF generation error:", error);
        // Re-throw to be caught by toast
        throw error;
      })
      .finally(() => {
        isGenerating = false;
      }),
    {
      loading: "Generating PDF...",
      success: "PDF downloaded successfully!",
      error: (err) => `${err.message || "Error generating PDF"}`,
    }
  );
};
