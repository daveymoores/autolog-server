import toast from "react-hot-toast";
let isGenerating = false;

export const generatePdf = (path: string) => {
  if (isGenerating) return;

  isGenerating = true;

  toast.promise(
    fetch(`/api/generate-pdf?path=${encodeURIComponent(path)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to generate PDF");
        }

        return response.blob();
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
      })
      .finally(() => {
        isGenerating = false;
      }),
    {
      loading: "Generating PDF...",
      success: "PDF generated successfully!",
      error: "Error generating PDF",
    }
  );
};
