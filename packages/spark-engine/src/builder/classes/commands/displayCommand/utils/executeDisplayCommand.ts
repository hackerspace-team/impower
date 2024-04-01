import { Game, Phrase } from "../../../../../game";
import { DisplayCommandData } from "../DisplayCommandData";
import { DisplayContentItem } from "../DisplayCommandParams";

export const executeDisplayCommand = (
  game: Game,
  data: DisplayCommandData,
  options?: { instant?: boolean; preview?: boolean },
  onFinished?: () => void,
  onClickButton?: (content: DisplayContentItem) => void
): {
  onTick?: (deltaMS: number) => void;
  displayed?: DisplayContentItem[];
} => {
  const type = data.params.type;
  const characterKey = data?.params?.characterKey || "";
  const content = data?.params?.content;
  const autoAdvance = data?.params?.autoAdvance;

  const uiName = "stage";

  const context = game.context;

  let targetsCharacterName = false;
  const displayed: Phrase[] = [];
  content.forEach((c) => {
    // Override first instance of character_name with character's display name
    if (!targetsCharacterName && c.target === "character_name") {
      targetsCharacterName = true;
      c.text = context?.["character"]?.[characterKey]?.name || c.text;
    }
    // Only display content without prerequisites or that have truthy prerequisites
    if (
      !c.prerequisite ||
      Boolean(game.module.logic.evaluate(c.prerequisite))
    ) {
      const r: Phrase = {
        ...c,
      };
      if (r.text) {
        // Substitute any {variables} in text
        r.text = game.module.logic.format(r.text);
      }
      if (!r.target) {
        r.target = type;
      }
      displayed.push(r);
    }
  });

  if (displayed.length === 0) {
    // No content to display
    return {};
  }

  // Stop stale sounds
  game.module.audio.stopChannel("writer");
  game.module.audio.stopChannel("sound");
  game.module.audio.stopChannel("voice");

  const clearUI = () => {
    const styleMap = context?.["style"];
    const preservedTextLayers = styleMap
      ? Object.keys(styleMap).filter(
          (layer) => styleMap?.[layer]?.preserve_text
        )
      : undefined;
    const preservedImageLayers = styleMap
      ? Object.keys(styleMap).filter(
          (layer) => styleMap?.[layer]?.preserve_image
        )
      : undefined;
    const preservedAnimationLayers = styleMap
      ? Object.keys(styleMap).filter(
          (layer) => styleMap?.[layer]?.preserve_animation
        )
      : undefined;
    // Clear stale text
    game.module.ui.text.clearAll(uiName, preservedTextLayers);
    // Clear stale images
    game.module.ui.image.clearAll(uiName, preservedImageLayers);
    // Clear stale animations
    game.module.ui.image.stopAnimations(uiName, preservedAnimationLayers);
  };
  clearUI();

  const instant = options?.instant;
  const previewing = options?.preview;
  const debugging = context.system.debugging;

  const sequence = game.module.writer.write(displayed, {
    character: characterKey,
    instant,
    debug: debugging,
  });

  // Display indicator
  const indicatorStyle: Record<string, string | null> = {};
  if (autoAdvance) {
    indicatorStyle["display"] = "none";
  } else {
    indicatorStyle["transition"] = "none";
    indicatorStyle["opacity"] = instant ? "1" : "0";
    indicatorStyle["animation-play-state"] = "paused";
    indicatorStyle["display"] = null;
  }
  game.module.ui.style.update(uiName, "indicator", indicatorStyle);

  // Process buttons
  const buttonTriggerIds = Object.entries(sequence.button).flatMap(
    ([target, events]) =>
      events.map((e) => {
        const id = game.module.ui.instance.get(uiName, target, e.instance);
        const handleClick = (): void => {
          clearUI();
          game.module.ui.unobserve("click", uiName, target);
          onClickButton?.(e);
        };
        game.module.ui.observe(
          "click",
          uiName,
          target + " " + e.instance,
          handleClick
        );
        return id;
      })
  );
  // Process text
  const textTriggerIds = Object.entries(sequence.text).map(([target, events]) =>
    game.module.ui.text.write(uiName, target, events, instant)
  );
  // Process images
  const imageTriggerIds = Object.entries(sequence.image).map(
    ([target, events]) =>
      game.module.ui.image.write(uiName, target, events, instant)
  );
  // Process audio
  const audioTriggerIds = Object.entries(sequence.audio).map(
    ([channel, events]) => game.module.audio.queue(channel, events, instant)
  );

  const handleFinished = (): void => {
    const indicatorStyle: Record<string, string | null> = {};
    indicatorStyle["transition"] = null;
    indicatorStyle["opacity"] = "1";
    indicatorStyle["animation-play-state"] = previewing ? "paused" : "running";
    game.module.ui.style.update(uiName, "indicator", indicatorStyle);
    onFinished?.();
  };

  game.module.ui.showUI(uiName);

  if (instant) {
    handleFinished();
    const indicatorStyle: Record<string, string | null> = {};
    indicatorStyle["transition"] = "none";
    indicatorStyle["opacity"] = "1";
    game.module.ui.style.update(uiName, "indicator", indicatorStyle);
  }

  let elapsedMS = 0;
  let ready = false;
  let finished = false;
  const totalDurationMS = (sequence.end ?? 0) * 1000;
  const handleTick = (deltaMS: number): void => {
    if (!ready) {
      if (
        audioTriggerIds.every((n) => game.module.audio.isReady(n)) &&
        buttonTriggerIds.every((n) => game.module.ui.isReady(n)) &&
        textTriggerIds.every((n) => game.module.ui.isReady(n)) &&
        imageTriggerIds.every((n) => game.module.ui.isReady(n))
      ) {
        ready = true;
        game.module.audio.triggerAll(audioTriggerIds);
        game.module.ui.triggerAll(textTriggerIds);
        game.module.ui.triggerAll(imageTriggerIds);
      }
    }
    if (ready && !finished) {
      elapsedMS += deltaMS;
      if (elapsedMS >= totalDurationMS) {
        finished = true;
        handleFinished();
      }
    }
  };
  return { onTick: handleTick, displayed };
};
