import { NotificationBuilder } from "../../utils/notificationBuilder/NotificationBuilder";
import { INotificationBuilder } from "../../interfaces/INotificationBuilder";
import { RichTextSection } from "../../utils/notificationBuilder/classes/RichTextSection";
import { TextBlock } from "../../utils/notificationBuilder/classes/TextBlock";
import { RichTextList } from "../../utils/notificationBuilder/classes/RichTextList";

describe("NotificationBuilder", () => {
  let builder: INotificationBuilder;

  beforeEach(() => {
    builder = new NotificationBuilder();
  });

  test("Header and divider", () => {
    builder.header("My Header").divider();

    expect(JSON.stringify(builder)).toEqual(
      `{"blocks":[{"type":"header","text":{"type":"plain_text","text":"My Header"}},{"type":"divider"}]}`,
    );
  });

  test("Rich text", () => {
    builder.richText(
      new RichTextSection().add(new TextBlock({ text: "my text" })),
      new RichTextList({ style: "bullet", border: 1 }).add(
        new RichTextSection().add(new TextBlock({ text: "list element 1" })),
        new RichTextSection().add(new TextBlock({ text: "list element 2" })),
      ),
    );

    expect(JSON.stringify(builder)).toEqual(
      `{"blocks":[{"type":"rich_text","elements":[{"type":"rich_text_section","elements":[{"type":"text","text":"my text"}]},{"type":"rich_text_list","style":"bullet","border":1,"elements":[{"type":"rich_text_section","elements":[{"type":"text","text":"list element 1"}]},{"type":"rich_text_section","elements":[{"type":"text","text":"list element 2"}]}]}]}]}`,
    );
  });
});
