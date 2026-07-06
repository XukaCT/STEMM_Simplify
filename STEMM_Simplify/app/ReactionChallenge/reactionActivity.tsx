import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, Pencil, X, Zap } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ReactionBoardActivity() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { startTime } = params;

  // Global State
  const [activePhase, setActivePhase] = useState<1 | 2>(1);
  const [memberName, setMemberName] = useState("");
  const [records, setRecords] = useState<any[]>([]);

  // --- PHASE 1 (REACTION) STATE ---
  const [handUsed, setHandUsed] = useState<"Dominant" | "Non-Dominant">(
    "Dominant",
  );
  const [reactionState, setReactionState] = useState<"idle" | "result">("idle");
  const [reactionTime, setReactionTime] = useState(0);

  // New Full-Screen Trial State
  const [isFullScreenTest, setIsFullScreenTest] = useState(false);
  const [trialScores, setTrialScores] = useState<number[]>([]);
  const [boxPos, setBoxPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const reactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionStartTime = useRef(0);

  // --- PHASE 2 (TRACING) STATE ---
  const [tracingState, setTracingState] = useState<
    "idle" | "active" | "result"
  >("idle");
  const [accuracy, setAccuracy] = useState(0);

  const targetPos = useRef(new Animated.ValueXY({ x: 120, y: 150 })).current;
  const currentTargetPos = useRef({ x: 120, y: 150 });
  const currentTouchPos = useRef({ x: 0, y: 0, isActive: false });
  const traceScore = useRef({ hits: 0, total: 0 });

  const traceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const traceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const listenerId = targetPos.addListener((value) => {
      currentTargetPos.current = value;
    });

    return () => {
      targetPos.removeListener(listenerId);
      if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
      if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
      if (traceTimerRef.current) clearTimeout(traceTimerRef.current);
      targetPos.stopAnimation();
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        currentTouchPos.current = {
          x: evt.nativeEvent.locationX,
          y: evt.nativeEvent.locationY,
          isActive: true,
        };
      },
      onPanResponderMove: (evt) => {
        currentTouchPos.current = {
          x: evt.nativeEvent.locationX,
          y: evt.nativeEvent.locationY,
          isActive: true,
        };
      },
      onPanResponderRelease: () => {
        currentTouchPos.current.isActive = false;
      },
      onPanResponderTerminate: () => {
        currentTouchPos.current.isActive = false;
      },
    }),
  ).current;

  const switchPhase = (newPhase: 1 | 2) => {
    if (newPhase === activePhase) return;

    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    setReactionState("idle");
    setIsFullScreenTest(false);

    if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);
    if (traceTimerRef.current) clearTimeout(traceTimerRef.current);
    targetPos.stopAnimation();
    setTracingState("idle");

    setActivePhase(newPhase);
  };

  // --- PHASE 1 (REACTION) LOGIC ---
  const startReactionTest = () => {
    if (!memberName.trim()) {
      alert("Please enter a nickname first!");
      return;
    }
    setReactionTime(0);
    setTrialScores([]);
    setIsFullScreenTest(true);
    scheduleNextBox();
  };

  const scheduleNextBox = () => {
    setBoxPos(null); // Hide the box to show "Get Ready..."
    // Wait between 0.5s and 2.0s
    const delay = Math.floor(Math.random() * 1500) + 500;

    reactionTimeoutRef.current = setTimeout(() => {
      // Calculate random coordinates keeping the 60x60 box inside screen bounds safely
      const top = Math.random() * (SCREEN_HEIGHT - 250) + 100;
      const left = Math.random() * (SCREEN_WIDTH - 80) + 10;

      setBoxPos({ top, left });
      reactionStartTime.current = Date.now();
    }, delay);
  };

  const handleBoxTap = () => {
    const timeTaken = Date.now() - reactionStartTime.current;
    const newScores = [...trialScores, timeTaken];
    setTrialScores(newScores);

    if (newScores.length >= 5) {
      // Calculate the average of the 5 trials
      const sum = newScores.reduce((a, b) => a + b, 0);
      const avg = Math.round(sum / 5);

      setReactionTime(avg);
      setIsFullScreenTest(false);
      setReactionState("result");
    } else {
      scheduleNextBox();
    }
  };

  const saveReactionResult = () => {
    setRecords((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: memberName || "Unknown",
        phase: `Phase 1 - ${handUsed} Hand`,
        score: `${reactionTime}ms`,
        color: "#FF5A00",
      },
    ]);
    setReactionState("idle");
    setMemberName("");
  };

  // --- PHASE 2 (TRACING) LOGIC ---
  const moveDotRandomly = () => {
    const randomX = Math.random() * 200 + 20;
    const randomY = Math.random() * 220 + 20;
    const randomSpeed = Math.random() * 1500 + 1000;

    Animated.timing(targetPos, {
      toValue: { x: randomX, y: randomY },
      duration: randomSpeed,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        moveDotRandomly();
      }
    });
  };

  const startTracingTest = () => {
    if (!memberName.trim()) {
      alert("Please enter a nickname first!");
      return;
    }

    setTracingState("active");
    traceScore.current = { hits: 0, total: 0 };
    currentTouchPos.current.isActive = false;

    targetPos.setValue({ x: 120, y: 150 });
    moveDotRandomly();

    traceTimerRef.current = setTimeout(() => {
      finishTracingTest();
    }, 10000);

    traceIntervalRef.current = setInterval(() => {
      traceScore.current.total += 1;
      if (currentTouchPos.current.isActive) {
        const trueDotX = currentTargetPos.current.x + 30;
        const trueDotY = currentTargetPos.current.y + 30;

        const dx = trueDotX - currentTouchPos.current.x;
        const dy = trueDotY - currentTouchPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 90) {
          traceScore.current.hits += 1;
        }
      }
    }, 100);
  };

  const finishTracingTest = () => {
    targetPos.stopAnimation();
    if (traceIntervalRef.current) clearInterval(traceIntervalRef.current);

    let finalAccuracy =
      Math.round(
        (traceScore.current.hits / traceScore.current.total) * 100 * 1.15,
      ) || 0;
    if (finalAccuracy > 100) finalAccuracy = 100; // Cap at 100%

    setAccuracy(finalAccuracy);
    setTracingState("result");
  };

  const saveTracingResult = () => {
    setRecords((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: memberName || "Unknown",
        phase: "Phase 2 - Tracing",
        score: `${accuracy}% Accuracy`,
        color: "#00A2D9",
      },
    ]);
    setTracingState("idle");
    setMemberName("");
  };

  const handleComplete = () => {
    router.push({
      pathname: "/ReactionChallenge/reactionResult",
      params: {
        activityData: encodeURIComponent(JSON.stringify(records)),
        startTime: startTime as string,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Human Reaction Challenge</Text>
        <Text style={styles.headerSubtitle}>Neuroscience + Biology</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activePhase === 1 && styles.tabButtonActive,
          ]}
          onPress={() => switchPhase(1)}
        >
          <Zap
            size={16}
            color={activePhase === 1 ? "#fff" : "#4B5563"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[styles.tabText, activePhase === 1 && styles.tabTextActive]}
          >
            Phase 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activePhase === 2 && styles.tabButtonActive,
          ]}
          onPress={() => switchPhase(2)}
        >
          <Pencil
            size={16}
            color={activePhase === 2 ? "#fff" : "#4B5563"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[styles.tabText, activePhase === 2 && styles.tabTextActive]}
          >
            Phase 2
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEnabled={tracingState !== "active"}
      >
        {activePhase === 1 && (
          <View>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerTitle}>Phase 1: Swap Hands</Text>
              <Text style={styles.infoBannerText}>
                Test your reaction speed. Try it with your dominant hand, then
                repeat using your non-dominant hand. The test will average your
                score over 5 trials.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>Nickname</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. John"
                value={memberName}
                onChangeText={setMemberName}
              />

              <View style={styles.handSelectorRow}>
                <TouchableOpacity
                  style={[
                    styles.handButton,
                    handUsed === "Dominant" && styles.handButtonActive,
                  ]}
                  onPress={() => setHandUsed("Dominant")}
                >
                  <Text
                    style={[
                      styles.handButtonText,
                      handUsed === "Dominant" && styles.handButtonTextActive,
                    ]}
                  >
                    Dominant Hand
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.handButton,
                    handUsed === "Non-Dominant" && styles.handButtonActive,
                  ]}
                  onPress={() => setHandUsed("Non-Dominant")}
                >
                  <Text
                    style={[
                      styles.handButtonText,
                      handUsed === "Non-Dominant" &&
                        styles.handButtonTextActive,
                    ]}
                  >
                    Non-Dominant
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* MINIMIZED UI - Actual test takes place in Full Screen Modal */}
            <View
              style={[
                styles.testArea,
                reactionState === "result" && {
                  backgroundColor: "#E0F2FE",
                  borderColor: "#BAE6FD",
                },
              ]}
            >
              {reactionState === "idle" && (
                <>
                  <Zap size={48} color="#00A2D9" style={{ marginBottom: 12 }} />
                  <Text style={styles.testTitle}>Ready to Test?</Text>
                  <Text style={styles.testSubtitle}>
                    Use your {handUsed.toLowerCase()} hand
                  </Text>
                </>
              )}

              {reactionState === "result" && (
                <>
                  <Text
                    style={[
                      styles.testTitle,
                      { color: "#00A2D9", fontSize: 42 },
                    ]}
                  >
                    {reactionTime}ms
                  </Text>
                  <Text style={styles.testSubtitle}>
                    Average over 5 touches
                  </Text>
                </>
              )}
            </View>

            {reactionState === "idle" ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={startReactionTest}
              >
                <Text style={styles.actionButtonText}>Start Test</Text>
              </TouchableOpacity>
            ) : reactionState === "result" ? (
              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
                  onPress={saveReactionResult}
                >
                  <Text style={styles.actionButtonText}>Save & Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { flex: 1, backgroundColor: "#E5E7EB" },
                  ]}
                  onPress={() => setReactionState("idle")}
                >
                  <Text style={[styles.actionButtonText, { color: "#111" }]}>
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {activePhase === 2 && (
          <View>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerTitle}>
                Phase 2: Tracing Challenge
              </Text>
              <Text style={styles.infoBannerText}>
                Trace the randomly moving target. Review your accuracy and motor
                control delay.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>Nickname</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Jane"
                value={memberName}
                onChangeText={setMemberName}
              />
            </View>

            <View
              style={[
                styles.testArea,
                {
                  height: 350,
                  padding: 0,
                  overflow: "hidden",
                  position: "relative",
                },
              ]}
            >
              {tracingState === "idle" && (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Pencil
                    size={48}
                    color="#00A2D9"
                    style={{ marginBottom: 12 }}
                  />
                  <Text style={styles.testTitle}>Tracing Challenge</Text>
                  <Text style={styles.testSubtitle}>
                    Follow the moving target for 10s
                  </Text>
                </View>
              )}

              {tracingState === "active" && (
                <View
                  style={{ flex: 1, width: "100%" }}
                  {...panResponder.panHandlers}
                >
                  <Text style={styles.tracingHint}>
                    Keep your finger on the dot!
                  </Text>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.targetDot,
                      {
                        transform: targetPos.getTranslateTransform(),
                      },
                    ]}
                  />
                </View>
              )}

              {tracingState === "result" && (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.testTitle,
                      { color: "#00A2D9", fontSize: 56 },
                    ]}
                  >
                    {accuracy}%
                  </Text>
                  <Text style={styles.testSubtitle}>Accuracy</Text>
                  <Text
                    style={[
                      styles.testSubtitle,
                      { marginTop: 12, fontWeight: "bold" },
                    ]}
                  >
                    Total Time: 10,000ms
                  </Text>
                </View>
              )}
            </View>

            {tracingState === "idle" ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={startTracingTest}
              >
                <Text style={styles.actionButtonText}>Start Tracing (10s)</Text>
              </TouchableOpacity>
            ) : tracingState === "result" ? (
              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
                  onPress={saveTracingResult}
                >
                  <Text style={styles.actionButtonText}>Save & Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { flex: 1, backgroundColor: "#E5E7EB" },
                  ]}
                  onPress={() => setTracingState("idle")}
                >
                  <Text style={[styles.actionButtonText, { color: "#111" }]}>
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        <View style={styles.resultsCard}>
          <Text style={styles.sectionTitle}>Team Results</Text>
          {records.length === 0 ? (
            <Text style={styles.emptyText}>No results recorded yet.</Text>
          ) : (
            records.map((record) => (
              <View key={record.id} style={styles.recordItem}>
                <View>
                  <Text style={styles.recordName}>{record.name}</Text>
                  <Text style={styles.recordPhase}>{record.phase}</Text>
                </View>
                <Text style={[styles.recordScore, { color: record.color }]}>
                  {record.score}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.understandingBox}>
          <Text style={styles.understandingTitle}>
            Understanding Reaction Time
          </Text>
          <Text style={styles.understandingIntro}>
            Reaction time measures how quickly your nervous system can detect a
            signal, process it in the brain, and send a response to your
            muscles. Typical human reaction time ranges from 150-300ms. Practice
            and focus can improve reaction speed.
          </Text>

          <View style={styles.keyFactsCard}>
            <Text style={styles.keyFactsTitle}>Key Findings:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Dominant hand typically reacts 10-30ms faster
              </Text>
              <Text style={styles.bulletItem}>
                • Visual stimuli are faster than audio stimuli
              </Text>
              <Text style={styles.bulletItem}>
                • Repeated practice improves reaction time
              </Text>
              <Text style={styles.bulletItem}>
                • Fatigue and distraction slow responses
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <CheckCircle size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.completeButtonText}>Complete Activity</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FULL SCREEN REACTION MODAL */}
      <Modal
        visible={isFullScreenTest}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setIsFullScreenTest(false)}
      >
        <SafeAreaView style={styles.fullScreenModal}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => {
              if (reactionTimeoutRef.current)
                clearTimeout(reactionTimeoutRef.current);
              setIsFullScreenTest(false);
              setReactionState("idle");
            }}
          >
            <X size={32} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.modalCounter}>
            Trial {trialScores.length + 1} of 5
          </Text>

          {!boxPos ? (
            <View style={styles.modalWaitingContainer}>
              <Text style={styles.modalWaitingText}>Get Ready...</Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBoxTap}
              style={[styles.movingBox, { top: boxPos.top, left: boxPos.left }]}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  header: { padding: 20, backgroundColor: "#000", paddingBottom: 16 },
  backButton: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#999", marginTop: 4 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 4,
  },
  tabButtonActive: { backgroundColor: "#00A2D9" },
  tabText: { fontSize: 13, fontWeight: "bold", color: "#4B5563" },
  tabTextActive: { color: "#fff" },
  scrollContent: { padding: 16, backgroundColor: "#fff" },
  infoBanner: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FFEDD5",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoBannerTitle: {
    color: "#111",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoBannerText: { color: "#4B5563", fontSize: 12, lineHeight: 18 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111",
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
  },
  handSelectorRow: { flexDirection: "row", gap: 8 },
  handButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  handButtonActive: { backgroundColor: "#00A2D9", borderColor: "#00A2D9" },
  handButtonText: { fontSize: 13, fontWeight: "500", color: "#4B5563" },
  handButtonTextActive: { color: "#fff" },
  testArea: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    minHeight: 150, // Reduced height as the real test is full screen
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  testSubtitle: { fontSize: 13, color: "#6B7280" },
  tracingHint: {
    position: "absolute",
    top: 16,
    width: "100%",
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    zIndex: 10,
  },
  targetDot: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00A2D9",
    borderWidth: 6,
    borderColor: "#BFDBFE",
  },
  actionButton: {
    backgroundColor: "#00A2D9",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  actionButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resultActions: { flexDirection: "row", marginBottom: 24 },
  resultsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },
  emptyText: { color: "#9CA3AF", fontStyle: "italic", fontSize: 13 },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  recordName: { fontSize: 14, fontWeight: "bold", color: "#111" },
  recordPhase: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  recordScore: { fontSize: 16, fontWeight: "bold" },
  understandingBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  understandingTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  understandingIntro: {
    fontSize: 12,
    color: "#1E3A8A",
    lineHeight: 18,
    marginBottom: 16,
  },
  keyFactsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  keyFactsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  bulletList: { gap: 6 },
  bulletItem: { fontSize: 11, color: "#1E3A8A", lineHeight: 16 },
  completeButton: {
    backgroundColor: "#00A2D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  completeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // --- FULL SCREEN MODAL STYLES ---
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  modalCounter: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 50,
    fontSize: 20,
    fontWeight: "bold",
  },
  modalWaitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalWaitingText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "600",
  },
  movingBox: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#FF5A00",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFF",
  },
});
