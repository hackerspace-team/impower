import { Game, Phrase } from "../../../../../game";
import { DisplayCommandData } from "../DisplayCommandData";
import { DisplayContentItem } from "../DisplayCommandParams";

export const executeDisplayCommand = (
  game: Game,
  data: DisplayCommandData,
  options?: { instant?: boolean; preview?: boolean },
  onStarted?: () => void,
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
    // No events to process
    return {};
  }

  const instant = options?.instant;
  const previewing = options?.preview;
  const debugging = context.system.debugging;

  if (!instant) {
    // Stop stale sound and voice audio on new dialogue line
    game.module.audio.stopChannel("sound");
    game.module.audio.stopChannel("voice");
  }
  // Stop writer audio on instant reveal and new dialogue line
  game.module.audio.stopChannel("writer");

  const clearUI = () => {
    // Clear stale text
    game.module.ui.text.clearStaleContent();
    // Clear stale images
    game.module.ui.image.clearStaleContent();
  };

  // Sequence events
  const sequence = game.module.writer.write(displayed, {
    character: characterKey,
    instant,
    debug: debugging,
  });

  const updateUI = () => {
    // Clear stale content
    clearUI();

    // Display click indicator
    const indicatorStyle: Record<string, string | null> = {};
    if (autoAdvance) {
      indicatorStyle["display"] = "none";
    } else {
      indicatorStyle["transition"] = "none";
      indicatorStyle["opacity"] = instant ? "1" : "0";
      indicatorStyle["animation-play-state"] = "paused";
      indicatorStyle["display"] = null;
    }
    game.module.ui.style.update("indicator", indicatorStyle);

    // Process button events
    Object.entries(sequence.button).flatMap(([target, events]) =>
      events.forEach((e) => {
        const handleClick = (): void => {
          clearUI();
          game.module.ui.unobserve("click", target);
          onClickButton?.(e);
        };
        game.module.ui.observe("click", target, handleClick);
      })
    );

    // Process text events
    Object.entries(sequence.text).map(([target, events]) =>
      game.module.ui.text.write(target, events, instant)
    );

    // Process images events
    Object.entries(sequence.image).map(([target, events]) =>
      game.module.ui.image.write(target, events, instant)
    );
  };

  // Process audio
  const audioTriggerIds = instant
    ? []
    : Object.entries(sequence.audio).map(([channel, events]) =>
        game.module.audio.queue(channel, events, instant)
      );

  const handleFinished = (): void => {
    const indicatorStyle: Record<string, string | null> = {};
    indicatorStyle["transition"] = null;
    indicatorStyle["opacity"] = "1";
    indicatorStyle["animation-play-state"] = previewing ? "paused" : "running";
    game.module.ui.style.update("indicator", indicatorStyle);
    onFinished?.();
  };

  game.module.ui.showUI("stage");

  if (instant || game.context.system.simulating) {
    updateUI();
    handleFinished();
    return { displayed };
  }

  let elapsedMS = 0;
  let ready = false;
  let finished = false;
  const totalDurationMS = (sequence.end ?? 0) * 1000;
  const handleTick = (deltaMS: number): void => {
    if (!ready) {
      if (audioTriggerIds.every((n) => game.module.audio.isReady(n))) {
        ready = true;
        game.module.audio.triggerAll(audioTriggerIds);
        updateUI();
        onStarted?.();
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
