"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const ZONES = [
  { x: 20, y: 95, w: 75, h: 70, label: "Front Bumper" },
  { x: 95, y: 80, w: 105, h: 45, label: "Bonnet" },
  { x: 70, y: 95, w: 30, h: 35, label: "Headlight" },
  { x: 198, y: 52, w: 20, h: 28, label: "Wing Mirror" },
  { x: 205, y: 80, w: 80, h: 85, label: "Front Door" },
  { x: 287, y: 80, w: 75, h: 85, label: "Rear Door" },
  { x: 364, y: 70, w: 70, h: 55, label: "Boot" },
  { x: 425, y: 95, w: 35, h: 35, label: "Rear Light" },
  { x: 420, y: 125, w: 60, h: 45, label: "Rear Bumper" },
  { x: 110, y: 150, w: 60, h: 60, label: "Alloy Wheel" },
  { x: 350, y: 150, w: 60, h: 60, label: "Alloy Wheel" },
];

// Irish county codes on number plates
const COUNTY_CODES = {
  C: "Cork", CE: "Clare", CN: "Cavan", CW: "Carlow", D: "Dublin",
  DL: "Donegal", G: "Galway", KE: "Kildare", KK: "Kilkenny", KY: "Kerry",
  L: "Limerick", LD: "Longford", LH: "Louth", LM: "Leitrim", LS: "Laois",
  MH: "Meath", MN: "Monaghan", MO: "Mayo", OY: "Offaly", RN: "Roscommon",
  SO: "Sligo", T: "Tipperary", W: "Waterford", WH: "Westmeath",
  WX: "Wexford", WW: "Wicklow",
};

const MAKES = {
  Volkswagen: ["Golf", "Passat", "Polo"
