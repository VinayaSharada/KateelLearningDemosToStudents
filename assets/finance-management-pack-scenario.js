window.financeManagementPackScenario = {
  scenarioName: "Northstar Foods Q2 management pack review",
  reviewer: "FP&A reviewer",
  approver: "CFO sponsor",
  staleEvidenceWarning: "The cost-mix bridge is from May while the draft commentary speaks about the full June quarter close.",
  contradictoryEvidenceWarning: "The AR dashboard improved collections, but one draft sentence overstates the risk outcome beyond the source evidence.",
  evidenceRows: [
    {
      id: "TB-18",
      area: "Revenue growth",
      value: "Q2 revenue increased 6% year over year.",
      source: "Trial balance row 18 / Sales report tab B",
      status: "Current",
      concept: "Fact"
    },
    {
      id: "GM-04",
      area: "Gross margin",
      value: "Gross margin improved by 120 basis points.",
      source: "Gross margin bridge row 4",
      status: "Stale",
      concept: "Fact"
    },
    {
      id: "AR-42",
      area: "Collections",
      value: "DSO improved by 2 days after targeted collections action.",
      source: "AR ageing export row 42",
      status: "Current",
      concept: "Fact"
    },
    {
      id: "WC-07",
      area: "Working capital risk",
      value: "Two large distributor balances remain above internal watch thresholds.",
      source: "Working-capital watchlist row 7",
      status: "Current",
      concept: "Uncertainty"
    }
  ],
  claims: [
    {
      id: "claim-1",
      claim: "Revenue momentum remained healthy across the quarter.",
      supported: true,
      sourceRows: ["TB-18"],
      status: "Supported",
      note: "Fact aligns to cited revenue row.",
      concept: "Inference",
      owner: "FP&A reviewer"
    },
    {
      id: "claim-2",
      claim: "Margin improvement reflects operating discipline and mix quality.",
      supported: false,
      sourceRows: ["GM-04"],
      status: "Challenge",
      note: "The result is factual, but the driver explanation is not fully evidenced and the bridge is stale.",
      concept: "Judgement",
      owner: "Controller"
    },
    {
      id: "claim-3",
      claim: "Collections improvements eliminated working-capital risk.",
      supported: false,
      sourceRows: ["AR-42", "WC-07"],
      status: "Contradicted",
      note: "Collections improved, but the watchlist still shows exposure. The conclusion overstates the outcome.",
      concept: "Inference",
      owner: "Treasury lead"
    }
  ]
};
