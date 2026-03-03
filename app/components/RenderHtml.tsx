export default function HtmlRenderer({ htmlString }: { htmlString: string }) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlString }}
      ></div>
    );
  }
  