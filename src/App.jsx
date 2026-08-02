import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";
import { definirApenasLeitura, papelDoMembro, membrosCarregados } from "./lib/storageSupabase.js";
import {
  listarMembros, definirCodigo, entrar, sair, membroComSessao, mudarCodigo, dadosMembro,
  dadosDeTodosOsMembros, COMPRIMENTO_MINIMO,
} from "./lib/auth.js";
import {
  Music2, Users, Search, Plus, Pencil, Trash2, LogOut,
  Phone, Mail, Building2, Calendar, CheckCircle2, Clock, XCircle,
  HelpCircle, Sparkles, MapPin, Handshake, Mails, Send, Workflow,
  X, ChevronRight, AlertTriangle, UserCircle2,
  Coins, Truck, Megaphone, Landmark, Gift,
  Copy, Eye, Braces, Bold, Italic, Underline, List, Printer,
  ListChecks, Square, CheckSquare, RotateCcw, Download,
  LayoutDashboard, TrendingUp, Trophy, Flame, Target, Award,
  BarChart3, PieChart, Medal, Zap, CalendarDays, AlertOctagon, Star,
  FileText, ExternalLink,
} from "lucide-react";

/* ---------- logótipo real da yme (embutido como data URI) ---------- */
// variante escura (texto navy + traço rosa) — usar sobre fundos claros
const LOGO_YME_DARK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAADMCAYAAABeHzmZAAA1E0lEQVR4nO3deVxU5f4H8M/sHBhnRmUUUUHclwKTUFtcIZcrmplierU0sGulaWmL3bR+mmlpqenNexPK0lywtFIrTbOsTEVNSSV3RAX0sMyMA8Psvz/GITQRZs6Z/ft+vfojmDnzeDjnM895znO+j8But4PwS6u7ngQASkWDHF+35Xac7bsTf227tzn3lc1mC7NYrAqr1RpR8/cikahCLBbphEJhFUD7zVW3OxZpH/5FXNsvTuSdXrX/wJGMM2cvoKSsDLEtWyCuVUuk9O81OqqpOtubjQwE+Rcvz9i955fFR48dx8k/zwIAoqKaoHtiAlKSe2V26dR+kjfbw5aUDblYcPn5sjJN/0uXCwVsSSnKyjS4UnQVxcXXUFFZCaPRAkOVsfo9TJgMMpkYEeHhUCoUiI1pjqZNI6GObAyFQo7m0c1yW8fFzA/Gv79Wdz3pzNkLCy7kFyTrdHoUFl3Fn6fPobj4GsrKddDqKmA0mVFpMMBotgIAZBIRwhkGMqkESkUEGjVUIC6uJdq2bgV1ZGO0bBFtb948KqtF82YfhmroaHXXky5fKXrqypXidOdxqNHocOlKEcpKy2AyW256vVQiRqPGjdAksvFNx15cq5jdsTEtlqgjG2330T/FJwS39qDzL16e8ebbyxZnrfwKgB1QSR2/MFuBiiowagVmPZ+O2bOmCbzfXP+j1V1PWvDOioNvv/cJYLACKikYiQgAYDBbAY0JAJD+9HC89vK0ma1iW7zriTacOHk6M+fQ0fiz5y4g50gucvPyYWA1AIQAJAAjAmSi6rZJxEIIBX//E9rsdpgttr/ab7Q6/l0wA7ABCEPXHm3RuVNb3N2lA7p1vdt+T9e7hgbaicOWlA35ce++bX+eOod9v+Xg8LE/wRaU3PitBIgQgQl3HPs195VELILZYoVE7NiPZosjrJ377e/7DIhuE40eiXfhnq5d0LFDG/R6oEfQdnLyL16e8cu+g4tz/8jD4d//wJHcU9AUlt/47e2Pw5rueOypGqBHfBskdYtH14S70LNHN693fLztpoDet//wsZRhE+MNlSaoG8tv+wazxQpNoR5de7TDzm1rUwPtxORT/sXLMwY9/MTiU8cKoIqWV5+0t8OW6sGES7F14wcVyf0evP3Oraeagbx+01c4sDcPgBFgwgGZCApGApmk1osjzoxmiyOM9CbAUAUAiOsUi4njR+D+nokV9yYm9PPHHuO+/YeP5Rw6Gr967Rc4euCk44cRYWDCpZBJRHf8+3FhtlhhNFthqDQBFY791SGhDf45ephf76/6KNdoe+UcOvbTtzv2CFav+xKawlIAsuqOCp/71Wyxwma3Q2cw3+j4OI75saMHYPjQAUhK7OqRDpAvVQf0oSO5ux4a+kSyzW6v18nN6gzoEd8GW79YHZIhXXyVTRv88BMbj566CLWCqdd7jGYLZBIx9ny3zuVv/uKrbNquH37e+O3OH3H49xM4dfoKAEChCvNoGNeX2WKFRmsAbEBcq6bo37c7Bqb0QUr/Xr0bqpQ/+6pdh47k7vp2x57kzV/twNHc8wD8Y5/V3F8d2jfH4Id6Y/DAfgFxNaLVXU86cPD3A9mbtwp++PEgLuRfBWQiqMKlHvuSuxNWZwCMVqjVcjzU/34MHzoAfXvfHxS5VB3QPfsMs+fm5UPOSOv9ZpbVY8q/RmL5kjdDbrjjldcW2N+e/xHUMUqX3sfqDHhkwAPYvPHDOvcZW1I25Pejx7d+8tnngt8OHPP5iVBfZosVmkoTYLSia3xrDEzphZEjhuy+t1t8ijc+v/gqm/bzrwc2rt/4Nfb8kgNNucEvQrk21fvLbEXXu7y/v+or/+LlGV9t3bF4/aavcCD3HAD41bFYfaWiN6FD++b45+hhGDF8cEAPgwjsdjsOHcndlZSYmqyOaeLyBtgCLXIOf+F3B5MnsSVlQwakjtt2vqDQrZOeLSjB8ZM7az1wiq+yaRs3fb1x/aavcCDndECEcm2MZgt0uirABjwytDfGjB6GASl9unvikr74Kpu2ek32xo2fb8fR3PNg5FKXOhz+oHp/SUQYOzwZT/xzpH1ASm9h3e/0nBN5p1d9smZTxmfZ21FYWObXX3ZOZosVmnIDGLkUY0cOxJOPP5Z7f8/EBF+3y1UCu92OZSuy7NNfWgS12vWhUbZAi6XLX8G0Kekh04s+dCR3V1LymOT6Dm3cii3QIvPjeUif8NhN+4wtKRuybsOWbcs++BQX8gqhaBbh9yeCK/QGEwxsFXr07ohJE8dixPDBvAx/5F+8PGPNui8Wf7xmc1DtN+f+GjthEF59aYrXe4LOYF6RuRGGShNUSiYgOwmszgAASB/zD0zOGB9QnUkhAJw9dwGQubnjVVL8cfJPPtvk97RaXU/n7Ay3qKT47eDhm360dv1me4/ej2ybPnUhyrU6qGOUQREyNckZKdQxCuSdKUDGxNm4697Bezdt3ub2RHy2pGzIvAXL7J2T/rF4zryVQbffnPtr3Ze7cVfn1Ix5C5bZ6zOHnaviq2zavAXL7HclDstY9P4aRzsa3/kmuD9TKxioFQyy1n+DpMRHkzOeedGef/HyDF+3qz5uBHR+9bQXVzESEcpKtfV6+CFYlJVrIup+Ve0YiQgXLlwC4DgZRox+yj5+7AvVAROoJ0J9ySRiqGOUqDQYkPboM/jnxOfs5RptL1e2sWxFlr19QvK2OfNWOgJEHbgBUhe1goE6RoE5r65A3wGjD+7bf/iYpz4ra/UGe3z3wRvnzFsJVUOm1tlcgcixH5XIWv8N4lr1X7xsRZZXvvC4EGp115NOnb0EmZsBLRELUVhczHOzgptELERFZSVO5J1e1XfgYxu37PwV6pjIoA2Y2kjEIqhjmmDdpp3oP2jM3hN5p1fV9Z7de37Rd+yabJ8+dSEAuDUsF6jUMUqcOn8ZD9w3Jn7ZiixeHwE+kXd6Vc8+w+wZE2fDbLGGxBfe9KkL0XfA6IO79/yi93WbaiM0GKriLuQVuf3HEAoEMBotMJnMrt9hDFBGI4fhDTh6kNdYLR4d83RGQSFb72l6wUrdWI5T5y9j6KOTMmob8si/eHnG1Odfs6cMzYgoulYaElcat+Mc9pg+9W08/+L/cQ5pre560rIVWfakPiMzcvPyQ2q/Or/wUkb8K+KV1xa4fBXnDcKqKmNLgFvgaHUVuLVGAbkzfUUFrrJlATfLwFPkjBSlGi3S0l/GwsX/qb701OquJ61dv9k+6OEnFq9Y9TnUjeVBM8bMhTpGgaWL12Lq86+5fZmef/HyjGem/fvg9JcWQSYRheSxKGekUCsYvL30E4wc86+9h47k7vJ1m2oSl5SWDXY8wus+o8nMU3MCA9cetFOo9FTqSyYRQy0RY9ac5TiYc+zgPV27YN9vOfhu1yEoVGFBNR7KB3WMEiuWboRYLDm4ZNHrLs2i2r3nF/3MWW9FHD1+PqSGiWqjbizHb4dPIil5TPKaD+bZx40Z4Rez0sQmk1l9416hWyRiEcxmExw9cUK4U6vl+G7PfmzZvhdMuJQC5A7UMUosXbwWrWJb2Os71TVr9QZ7xvPzwEhE9KVXg5yRQiaxYvzYF3Ah/5L9uWef9Mh8fVcI9fqKu7lswPH0jqXuFxLiAufUrlC87HaVOkaJ6S8tws5de+u8FJ63YJk9Y+IrUIUH3kM83uC4cR2JOa8uwcRJMw6yJWVDfNkeoVan49yVd1agChV6fYWjKhchfkKhCsNzM/9PUHyVTavtNVOff80+59UlITljyFXqmEhs2b4XA1LHbavP7CJPuXG3ReKrzyce5KxNANyufOOt/ioFCTjmakvEwpC5IeeslFZdMtRsBSqszt/WeOWNc+WWfeXJanj1IZOIcersFcxfuGzj8iVv3lTKVKu7njTjlbkHs1Z+CXVMpK+aeIfjsQY/2q/O2UWPjnk6Y+1HS+J88QSimOsNL4lYVL3TiW/pDaa/alAzIsS1aoq42GaIimqC5s2aonl0FBo3bgiZTAqlQlE9RUur0wmMRhNKS8txpbAYZRoNrlwuQvG1Mlwpuga2QOt44Y2Tx9PlTL3hpn0FAaLbRKJl80hER0WheXQTNGmiRnSzppDJpJDJbh4KuN2+ulBQhFMXix3bu1FL2tvholIyWLF6C54Yn7bLGSbV4bx6q8uFvbi69Xjs0L454mKa/a0gv3P/Go0m1FxYoqy07Ob96oESpnWRM1IUFLJIGzc1OXvt8l3eDmnOZ5mzYDnxvurqXWwVVNERGNSvJ9q2iUWH9m2QEN95d4vmzT5kmLAL7tzo0OquJ9lstjCt9nr3wqKrj5+/cDH+Qv4lXLx0GcdPnHJUM7tx0gRKISe9weSoYS0ToX/Pu9G5Y1t0TbgLnTq2y20dFzOfy74ymcxNrrElw38/ejzj+IlTuHSlCCfzzuLoqYuAxgRGzXg8WJzbXrI8M/mzj9+HVnc96Y157znC2Qs3WmtWk4NMhEG97sHdd3VC/N2d0LFD292xMS2WSKWSa/Xdx7fu19w/8vDH8Tz8tD+3uhCSN8JazkhRXFKOh9MmJ+/cunqVN2uiCDI/Xm/PmDjb7W9X5x/lZM43QVcsuzZciktxVbM0ZYe2zZF4TxcMHzoAnTu191oxnXKNtte58xdf//PU2eQff/4Nh4+c8NvqcUazBTpNFdRqORITOmLkiFQkxHfe3a5t3CxP36EvvsqmXb5S9NSfp84m16zj7en9xBZocSF/z8w1675YPGfeSo8fp87a1gpFGO5N6Iixo4d7bB87lyY7lnsy+fPN27Dv0HHodFVeKeSkN5gQE63Gd1994rWs4xzQgOMP9Pu+rRTQHuQsnxgd3QiDBzyAtBFD/aa4u3P5qI9Wb6ies+zrIRBnb7lHUnuMGfWwT9aFvJVz0YWPP83GDz8d9dh+Mpot6NQuBq7Wd3dVzWNy/GNDfVLD+tCR3F3Zn29NdpZCVTX0bFA7Fyr5MjvLK8uW8RLQAHBw75cU0B5gNFugK9IgrlMs5s6ehoEP9fXrlSKqH4A4cMbrY57Vq5RUVGLshOF48vE0zsuLecqmzdvsL7+2CBfyr3rkOKq5bqIntq0p1AMqKTKXzMaw1AE+PyadpXrfWLACmkJ9nUvQcfqsUj0eGdIbH6961+PzpDkXAjdbrJBIpAgLk13io0HkL2yBFq1jopH9xQqcP/mTYNyYEQJfnwh1Se73oPz3/d8IFiyaDrZA55V7FGaLFWypHprCCrw8/QlcyN8387OP3xf4azgDwKgRqYLf92/r/vILT9RYrJY/nggns8UKltWjoVKBzI/nwV5+QpA+4TG/OCbVkY22T5uSLsjP29s98+N5CGcYsKxnaiCpG8uxZetezHhl7kGPfEANvKzUIJPSND0+Gc0WsKweCxZNx487N3YfNSLVLx47dcUrM58VZH/xHjTlBo+GNKszQFNpwovPjceF/B9mLnxzliBQruSUigY5C9+cJcj+YoXXvszcpTeYoCk3YO7sp7Fvz+ejb11swl8oFQ1y0ic8Jjj861ejHV9+WugN/JRmqEmtliNr9VbwXVXwVj5dSof8HaszoFmTxti1PbPilZnPCnz9qCkXo0akCnZ8/aFdU8h/T8bZmxs7PBnH923JfOetfwdMMN9q1IhUwY7vM+2Oedj+FdJmixVsgRZ9esYj55fs3bNnTRN4Y+yVq6im6uyFb84S/Prbhtz7EjuDZfW871tVQwZz3loOT9bn5iWgpVIxRCJRBR/bCmXOGxDfffXJTH++PHfFgJTewqXLX/lrLjUPzBYrGioVyF67GB8sm9/d1zf/+DAgpbcwc8WbfvVMgdFsgabShLlvTcGGtSu7B9JSUU7390xM2LDmg9SXX3gCmkoTryEtEYtgttjw5OSX4j31SDj1oP0EqzOgf8+7sfWL1amB2hOszbQp6YJBQ3vwdqmpKdRj7uxpGDUiNaCvMG41akSqYNbz6WBLfV8/Xm8wobFKieystzF71rSA3s/qyEbbF745S5Cd9TYA8DrkIWekOHX6Ct56e/k23jZaAwW0H9AbTOgR3wafrV4+2h9uuHjCvDde2s3f1gQY+FDfVP625z8mTxqf2iOxvU8LkLE6A+I7tcLWL1ZlBuL9j9qMGpEq+H7rJ7tjotW8hrRaLcfSxVn1KlblKgpoHzNbrGiokCPrv4szA2Fsz133dotPGTtyYPUKy1xJpZJrvGzIz6gjG22fMnkCdEW+GTFkWT0eGfAAtn6xOjUYho5udW+3+JQfd2wY3aF1C96ORQBQNGuEyc/NFvC9KgtvAU0rqrhHU1iBt+fNRDCeDLeanDGex1508Br4UN/UDgkxXr9hyBZoMXb0AHy86t3uwXolBzhuIP64c2P3Qb3u4W04SSYR40L+VaxYuXovLxu8gZeANplCqx60oaqKl+3oDSY8ktYXQ4c81J2XDfq5dm3jZg3qdY9Hpj0FE3Vko+3DU1McD914CcvqMXbCYHywbL7Pi9R7g1LRIOfTj95PfWRIb9560mq1HAuWZIHPZbNoiMOHDKwOz05+vCIUTgjAcVLcf1+So5gOuaPEbncDFfx0BOrC6gzo36dryISzkzqy0fYP3p8/elCve3gLaYPZiiXLM5N52RgooH3GaLagR+943JuY0M/XbfGmHkn32P9WA9gNwb6KfFJi15lQeX7UUG8woWuHWGT9d/HMUApnp6im6uzFb8/J7NohlpcrO7WCwbovd2P3nl94GTuhgPYRnaYKY0Y9jFA7KZo3j8pi1Azn8dVgv+fRsKFyb9cOsR6dzWG2WCFnpPjP0nm5wTa10xVdOrWftHjBqxV8XdkxEhH+899PeTk+KaDdYDZbuO85QxUeuD8p5G6aNVFHfhkTrfZ1M/yeUtEgp3Onth5dTk5TqMeC/5uJ+3smJnjsQwJEcr8H5ZkfvMFLXRQ5I8WWrXt56UVTQLuhoqKS0/vNFivUMZEIxCez+KBSRsBm92gJg6DQSKVwrEjiAazOgLETBsNfa2r4QvqExwRjJwzjZTyakUt56UVTQLvBZrMBEverhRnNVtzduS2PLQocYrFI5+s2BIqICM+M4pgtVkQ3VuLVl6ZkeuQDAti7C2ePhtHKeQhOzkixZftecF1wlgLaBwxmK+LiWvq6GQHMjqoqY9DvwIiIcMfitTzTFOrx0vT0kJh776qopurszA/egKach1kdEhEyP1qfwWUTFNBuEAq577ZGKhX3hpCgdv26ntOV2u2YLVZ0SIjB2MceCcpH5fmQPuExQY+k9pxndagVDJZmZkOru57k7jYooN3AR8+Gj5Anwc3sgRkcmkI9Xpw+CcH8pCAfZkx7ip/xf00Fdu76ye3C/pQS7uJyc92PSkoS/yXheb1Cs8UKMCIMGZw8mtcNB6EBKX269+95N/e50aoI7Nj1k9tvp3rQblA0CIpSzSTEaCpNmPKvkQjmolx8USoa5Ex8PA0GlttYtFrBIGvllyi+yqa5837qQROvslisCl+3IWRpTBgz+pFcXzcjUAx8qG9q1x7teHhYyIyffz2w0Z13UkATrzMaLRAKuEy/NaOisrIjbw0KAY6590p06dye06yCUKKObLS9b68e0BnM3DbEYZiDApqQEGA0W/Fgz24hV1qAq9R/JFdAwy2gVeFS/LLviFuzOSig3cBXudFQRk8SepdBb8KQwf193YyA06Vzhyej20RyenBFIhbh1LECnDl7YYGr76WAJl4lFot0Mhm/sxNI/bSKbREyN/L5EtVUnd0j8S5eFvP9dV+Oy2VIKaAJCQGMXIqoqCbrfd2OQNQ9KYF7DXOVFGfPXXD5bdSVISQEyBkp/vvhpxkRERF3vElos7k3wd9gcG86msFodPPz3HsfABgqXRuiLCwuhqoh4/bnAYCCkSDnSC7KNdpeDVXKn+v7Pl4CmgmTUREcQvzcitVbfN0EXjE8PwZfG5lEBImY22cJBQLk5uVDq73e3esBTYh32WAwVMX5uhWBRq3g1gsk7pOIRdAU6lFYdPVxVxZHoDFoQgjxkiuFRfGuvJ4CmhBCvCFChD9PnXPpLRTQhBDiDRIR/jxNAU0IIX6HkYhcnkFCAU0IIV6i1elceuSbc0DTI7vEFRaLVWE08l+InhB/JxELUVFZCZvNFlbf9/DSgw61R3fNZgtde3DErZodYDKZ1Tw1hRCvMRotLpXcpZghhBAvcHZKrFZrvZdrp4AmhBAvMVS59og6BTTxKqvVGuHqQUpIqOItoIVCIRVJJoRHnljVm/gWEyZz6fXUgybET/G9qjfxLeeMN1cW2KaAJsRPCYVCgIdC8cR/yGRiSKWSa/V9PS9f0RHh4XxshoQIk4nrpbsQBoOhDS+N8WMREeGAe+WZb6I3mGCgoPc9jQkRCa5lJV1DEa+TSumwqw9FAznnbZgtVjwypC+aRDbmoUWBQSIRO64+/IzNZkPz6CiXFu7lfKaYLTx8xZOQwr0HHRrk8gjAwK3nqynU49l/PZF7f8/EBJ6aRbyIl68ZKd3MIPVUVWVsaTRxW8Y+VDgWeeW4rxgRcg4ddakGMfEf/ncdQAgBAF4WeWXkUvz08wE+mkN8gJeAZpjQuklYUVHp6yaQENBEHfklIOW0DZlEhAsXL6P4KpvGT6uIN/ET0OFhLg18E0Lqpo5stD26TSTMFvfHoSViEY6euogTJ099xGPTiJfQEAcJSFarLSQu2/r2uhdGrlPkzFbs+P6nehfoIf6Dc0AbzFYwjGuPLxJC6qd7YgIMehOnbSgUYdj76wGXCsUT/8DPEIeMApoQT+jUsZ2d61Q7mUSMA4dP49DhY3t4ahbxEhriIF4VFia7JJNKfN2MgNG+XesXOU+1AwCJCOs3fUXDHAGGc0AzEhEMRiof6RIboFLVe1EFEsJaxbZ4t2uPzjByrGynVjDIWv8N2JKyITw1jXgBLz1og4EC2iUhft1Cj3q7ZsTDA6HT8VDN12jF19t2buO+IeItvERFWWkZ3YAg9SISiSpcrYkb6pL7PZgLiYjzdhSqMCxauorO1QDCOaAlYiHKtTqXVqolhFaDr78undtndIiN4jQfGnDcLDx17Bx27vrpIE9NIx7GOaCFAgGusVoYjaZmfDSIBDexWKQLtVXguVIqGuQMT02BppLbdDsAYNQK/HfVWupFBwihQsGtpKFELMKFohKUlpU/xFObAgMPl5yhiJZGc8+w1AG5MHKv6SxnpPjhu/3Uiw4QwkYNVdwrZmlM+P3o8Qx+muT/bDYqscoFLfDgui6d22f079MVegP3XrSimQqz5y6h+hwBQKhUKvZzXrYhQoTjJ07x06IAYDAYfN0EEmKUigY5Y0cPh4HlfgEik4hx6vQVrPpo3UYemkY8SNiiebMPAW7395hwKU6fucBTk/ybVnc96ey5fDA0xEG8bMjg5NEdElpyvlkIAGq1HO+tWI19+w8f46FpxEOEUU3V2V17tOU0EV7OSPHL/iM4kXd6FY9t80sGQ1XchYIiyCig3VZRyb1cq1anE/DQlIAS1VSd/c/Rw6Ap5+cKzmi2Yt5bS+LphqH/EgJAYrcu0Bm4jUOzrB77DxwJ+nHoy1eKnjp1sRgSMQW0O2g6Jjfjxz46U9WQ4aUXLWek+O6HQ3j/Px/RDUM/JQSAuzt3BDTcbj4wcinWbfySjzb5tW937EkGrZDsNovFqjAaLRAKQq4DzItWsS3efWHKBN560SolgznzVmLt+s00Md0PCQEgJblXJsDtcW05I8UP+/8I6jEtre560uavdkChoE6gu6xWa4ShikoDcDHpybGjGbmUl160RCyCWi3H+LEv4NCR3F08NI/wSAgAXTq1nwRVA85/cEYiwuIl/wvaBSq3bv/+4NHc85DRIrmccF/VO7Sr4UU1VWcvf+dVaArLedumKrohkpLHJIfCfaRAUv0k4fSMNM5PKskZKbZs3Yudu/YG3URhre560ptv/wcKFfWeueBrVW+jkft84EA2csSQ7nxUuXOSiEVgJCI8OubpDApp/1Ed0Kn/SK7g40klhSoML7+2UBBsd4bnL3z/4KmzV6j3zAOz2UQ3WTlSKhrkLF7waoWuiL8FjOWMFKcuFiN98kwKaT9RHdD3Jib06xrfmvM3skwixtEDZ7DgnRVBc2d40+Zt9kULVkPdmNtj8QSoqKzsaLZYOQ+nhXoPGgCS+z0onzI9DayOvwen1AoGB3LPIX3yzAwak/a96oBWKhrkjHh4IHQa7k8qqWOUeHv+R9i0eVvA3xnet//wsScmvwpVNIUz8T//fmXa6K4dYnl5BNxJrWCQm5ePtHFTk3fv+UXP24aJy26qZjd+7KMzo6Mb8XJ3WBUtR1r6ywE9Hn3oSO6uUeOmxkvEQrokJ34pqqk6e/GCVysMPE/9lDNSlGq0SOn/ZETW6g0B39EKVDcFdKvYFu+OGNofGi33SyaJWARVuBQDhz0lCMSe9M5de229B41L1ldW0rizH5LJpL5ugt9I7vegfOm8F8AWaHndrkwihio6AhkTX8LU51+zB9t9pUDwt3rQk596PFPdWM7bHEtVQwZp42Zi3oJlARPSWas32AeOelogk4gonHkWER7+p0QsoisSnk2bki4YO2Ew2FJ+RyQkYhHUMU2wYtXn6Dtg9MFAes5Bq7uedOhI7q5Nm7fZs1ZvsGet3mDftHmb/dCR3F2B8mXzt/Tp0qn9pKmTx2fMeXUF1DFKzh/gDOk581fi96Mn7O+9M2dmq9gW73LesAewJWVD5s5/b9uK/30OVUOGQsRDJBIpKg0G2r88e3fh7NEn885uPHX+MuQMv1cY6sZynDp/GSnDJsbPej7dPnnS+FR1ZKPtvH4IT07knV71yZpNGd//8CtOnb8Mg/7m8XlGLk3u0LrFwSmTH8fIEUO6KxUNcnzU1DrddkWVSU+OHd21Rzte51iqG8uxZeeveCA5bXHW6g1+d7m0c9de24DUcdtW/O9zqNVyCg8Pkkm5P2hCQxx/F9VUnb3qg4W7DWbus2RuR85IIZOIMGf+Sgx9dMI2fxu6zL94eca8Bcvs/QaNzVj0/hqcLyiEnJFCrZbf9J9MIsL5gkJkTJyNZ6b9+6A/r3R+24COaqrOfvWlZ6ArquD1w9QKBpUGAzImzsbESTMO+sMd4kNHcndlPPOifeCwpwSnzl+GWk2zNTwpLEx2ifuq3twfdAlW93aLT8nOehuaQr1HQtrZ2co7U4C0R5/HPyc+Z/f1sEfxVTZt3oJl9kEPP7F4zryVMFusUDeW1zo8KRE7hi7VMUqsW/0t5s5/z29XOq91TcJRI1IF6U8P99CYlhLf7dmPlP5PRvxz4nN2XwT1oSO5u6Y+/5o96cG05Kz130CtlvN+WUj+jq9VvZUKhV/13vzJqBGpggWLpkNT6LnTyhlwW7b/iAfuGxOf8cyLXg/q4qts2sLF/7G3vjt545x5K3GVLXP56lcdo8SK/33ut7PN7rho7IK5s1LVjeW8DXXUJGekUMcosGX7j0jpPy4iefBj9rXrN9vLNdpevH/YDeUaba+16zfbBw8bZ09KHJa8YvUWqBoyUCsYT30kuQ2ZTMx5VW+5POIPnpoTlF6Z+azgxVkTeJ/ZcSvneZy1/hs8cN+j8cmDH7Nnrd5g9+RyWifyTq+at2CZPb774I2zXlwKmUTEbVhSJkL25q1+WV7xjtea6shG27/Z8tHupMRHk1XRnhmXlTNSyGMi8dvhk/jhu5cBYO8jaf0wYvgg3NP1rswWzZt96O4gvlZ3PenM2QsL/jx1Nvmz9Zvx3dYDAABGzUAdE8njv4LUl1QqucZ9TUIbpFIJy0uDgtg7b/1bIBQK7W/P/4iXG/53olYwgIK5cR4fBvDSxh69u26cNHEsOnVsl9s6LmZ+VFN1tjvbzr94eca58/n/d/zEqYiVmetw6tg5ICIMKiXDy79LwUhw4cIlaHXXk/zthmGdg4H3dotPWbPubfv49Fc9Oj7rCGrHEMN3e/Zjy9a9gEyU0SE2KiPxni64u0sHtGjeDM2imlRERTVZHxEe/mfN91dUVna8cqU4/dLlQkFh0VX8fvQEjv5xCheKSgCjFYxc6vGDlNSPUqGA2WKDzO17hWFwLNVG6rLwzVkCAF4JaeDm8zjvTAEynnkDECJe3Vi+8e7ObTfGxbVE29atoI5sDIVCftNQlVanExiNJpSWlqOo+BouXSnCufP5yDtT4HjCWQgoFGG8d66EAgGuFLEwGKriAi6gAWDcmBGC0tJy+/SXFnll+pmckVaPB19ly7Bl+49Yt3Gn45dCRKiUTEY4w1TPBjCazKg0GP4qYi50rJMok4ho+MLPKBUNcho15hYUjDoM7vbGQtGsl6Z0j4gIP8jX1Nn6kknEN3Xqfjt8Ej/s/wO3FGW7/dDCjXNYIhZCKBCE7M37et9OnzYlXaC7rrfPmbfSq3OEnQ811LyBZ7ZYUWkwoPLG6trOtoTqHzHQNFKpYDBbIXfju9NotqBD6xb8NyqIKRUNcmbPmiZQNJDbp09dCE8NV9bF0fHy+sfWyWa3Q6WMAMOE+d3K13e8SXir2bOmCRbMnQpNucEjU3jqyxnaNZ9Io3nLgSPp3gS3l1jTGcxI7NaF5xaFhmlT0gWZH8+DptLkkRv/gcpssaFN61bwt+ENwMWABhx3h5e+8yKvqzmQ0JKU2HUmGDe/UDUmDEzpw2+DQkj6hMcEOzattMskYl4r4AUyA1uF7okJvm7Gbbkc0IDjmzj7ixVgC0roj0xc1iq2xbsvTh/v8hQwo9mC6DZqDEjp091DTQsJA1J6C/d8ty7zvsTOHp+G5+/MFiviOjXDw0MHzvR1W27HrYAGHJPhj5/cmRnfqRVY1ucPBJIA88K0p0Z3SIip9xe82WKFTlOFT1e9U+GPl6KBpkun9pM2b1zVfe5bU8AWlITskIemsBz/fulp+Gt9ILcDGnD8kbd+sTp1+rNjwLL6kPgj87EaCHGUE/hi/cpMAHWGtNlihabcgMwP3kByvwfpTjBPnDcPd3z/qb1Zk8a8PzXs79iCErw4axLSJzzmlw+pABwDGnA8zLJk0euC7LWL0TomGizrmRoA/oDVGdBU3QitWjYL2n+jN3Xp1H7S3u/W7nZeahvNlpv2q9liBatzVL3L/OANvz6RAtmAlN7CH3dsGJ3++FCwrD7ohy31BhNYnQFLl8/GO2/926+PKc4B7TRqRKpgy8YPZ744fTw0laag+iMbzRawrB5jhyfju68+mTni4YGcV0AnDvd2i0/ZsOaD1KXLX0HrmGgYzVawrB4sq0c4w2Ds8GR8s+Wj3RTOnhXVVJ2d+cEiQfbaxXAOWwZbJ8RscRxb9yV2xq/ffpo7bUq63x9TAjvHmgi3s2//4WOz/29R/A8/HYVCFRawRe+dl9Yd2jfHvDnPY9SIVAEALFz8H/usOcvdnnfNluqx4I2peGXms35/gHhTuUbb69z5i69rtbqeDMOci27W9FN/HRsMZmxJ2ZCs1eu3Lf/vZygs1QbFw16szoC4ZpGY9szjmPB4ml/XgK7JI8l5f8/EhN3fbsCmzdvsb73zAY4eOAlGrQiYanFmixWaQj0YNYOl77wYUH/QQNZQpfz53m7xKb5uR6hTRzba/srMZwWPjXp4xrIVWYuXLs4CVA2gCpcG3PMGrM4AaK5j+sx0TJuS7reLhdSGtyGO2xk1IlXw+/5vBDu+/9TuGGcs4XWJeL7pDSawBSUIZxgsXf4KLp78MXXalHQBhTMJRa1iW7y7ZNHrggv5+2ZOmfAINOWGgBj6MFusYEv1YAtKMHZ4Mo6f3JW5ZNHrgkALZ8DDAe00IKW3cPe3GwQ7vv/Unj7mH2ALdH4z68N5I4otKEGfnvFYs+49nDyyo/u0KekCf13ShxBvahXb4t3lS94UXMjbNXPB3Kloqm5U/QyEP4W1o4OlRTjD4OXpT+D4yZ2Zn338vqBLp/aTfN02d3lkDLouJ/JOr9q6/fuML7fuwIG9eQAjAiOXem0IxGi2QGcwAxoTOiTEYNg/+mP4sEG5XTq3z6hPb5nGoEkoY0vKhvy4d9+29Ru/xnd79sOgN3n1/HUyW6yOm/UaE1TRcvxjQC8MHzoAvR7oMTpYimn55O5dl07tJ3Xp1H7S0089nnTo8LE93+/+OSLn8DFHpSuNCVBJoWAkEAoEnMe8zBYrbHY7zBZb9eKRPZLa477uiRg8sJ/9nq53DaWeMiH1p45stH3UiFTBqBGp1Z2tgznHsOeXHMcqLiopGIkIMgm/dXIc0zD/Oo87tG+OR+/vhvu6JyK534MBN74MI5Qw2B21UxlBCWT422OdPp1eoVQ0yEnu96A8ud+DNxXX/3bnjzh3Ph+XrpSgsFTrKE8oE4GRiKrLDwKOP7zzEssZwgBgMFur3xPdWIkmkSp07tQW/fvcj4T4zrvbtI79v4Yq5c8++4cTEiScnS2t7nrS5StFT53MO52Rc+gYDv/+B64UsbjKlv31pPGNcxgAJOLbj67edA6brYAN1edx82ZNEBfbAn169cBdXTpUtGnd6vWAC2UAOGcbin2WN1BivwvX7I7LjggAscIj6Ct+AS2FPzlf6pMhjvrQ6q4nlZdrexcWXX0859DR+PyLl3Gx4AoKi4thNFqg1VVAX1EBiUSKBnIGTJgMjRoqEBXVBC2bN0O7tnHo1LFdbnSzpp82bKjcy+eNPhriIKRuxVfZtNKy8oeuXClOz/vzjOBKYTGuFF1FWWkZyrU6AIDR+Nd9KJlMjIjwcCgVCjRqrERsyxaIbtbUY+ex17H2eHxh+ha5tmgAwK0XFtYbP/un5DX0FM8HfNyDvhOlokGOUtEgp1Vsi3fv75n4t99rddeTTCZzE6lUci2g/2iEBKmopursqKbq7C6d2k8akNLb183xrXO2ocg0fQ2t3RHCt7uAEMJxxfCp+U00F/6ClsKf/Dag60KhTAgJCOdsQ7HU+DUAoK5l3oRw9KQ/N+/E8zKZV6bZEUJISDJCidUmRzjXN20lAM7YpGDt8RTQvmDzdQMIIV6RbfoBpXb3njg5bx1CAe0jTFiYr5tACPGkA5ZZ+M3arc5hjdroEEsBTQghfDtnG4p15rf+NlPDRRTQhBDCJ9Yej0zT17CBW8KKYKSAJoQQvrD2eLxvPAatm+PONcUKd1FAE0IIH5zhXGqvezrdndgAKAVAC+FeCmhCCOHqnG0o3jMeg4ZjOAOOedD3iT6HDNqAfVCFEEL8wknrOPzPtIbzmDPwV+95oCQD8ONHvQkhxK8ZocRey9v42vwvAPyEMwCMl4x3VrajgCaEEFfVLHxUW20NV1kBDBJ/js6itc4fUUATQogrvrf8F9vM/4IZ3MebncwA2glNGCYZVfPHFNCEEFIfByyz8KXlreqKdHyFs3PceZw06dZfUUATQkhtNPY2OGJ9Dvssz6GQ52AGbh53Vgtyb/01BTQhhNSksbdBoe0+HLY+j5O2brz3mGuyAhgpeb/muHNNFNCEkNBmhBLXbF1xxfYgTtieQL6tHUpvrDTlqWAGHOPO/UU70V88rbaXUED7ghAwVFX5uhWEhBYjlAAAnT0W561DcNXeDaw9AUW2drhqd/RmAc+GspMZQKLoDEZKB97pZRTQbqBSoYT4KedK2dftLXDd3hI6eywu23qjxH4XSuzRqACgvWUdVmfFOU+HspMznNOl7et6KQU0IcS/3Rq61+0tUYEoWCGD1hYHLeKgs8fiml0KfY2e8K28HcS3ssH5GPcRjJf+faHV26CADlasPR7nrUNwydYXBkT6ujkkBDAogVSg++v/BaUQwQgrZDDYG1f/3GRXAAAMiIQJDWC2R1QfoxV2KQDACMACoPJGb9dcx2fXrLvsqwC+E2c4PyL5Hx4ST67v2yigg43G3ga7zB/gZ+uAOg9qQvzJnYrb8/W0ni+Y4ZjnPFz8KnqIF7jyVgroYMLa4/E/4zGPzNckhLjG2WtuJzRhpGQAWgp/cnUTFNDBwghldThTMBPiW87HwPuIdmKoNM1Z/MhVFNDBYoc5k8KZEB+r2WseJhmJNsKtXDZHAR0sdltGcl2gkhDiJmcwKwXAw+LX0FM8n4/NUkAHg0u2PrxW1iKE1E/NYH5I/D4eEM9xdzjjdiigg8F1e0tfN4GQkOEMZQCIFgD38x/MThTQwUAm4P3AIITUUDOUJQC6is7gPtFctBFt9UQwO1FAB4MWwr2QALysiUYI+asMqDOUlQKgicBUHcq3KQ3qCRTQwUAGLe4VHcFv1m4U0IS44dZAFgGQC4C2wjPoIvzEm6FcEwV0sBgqScMh61nqRRNSDzWHLIC/ArmJwIQE0X8RK9yFxoKTUAnO+aiFACigg4dKcA7/ko7HStMamtFBCP7qFQN/L6CkFACxgkJEC/ehqeAIWou2+6KHXBcKaDcYqqr8s5faWbQWL8ku4RPTjyisUXCckGBVW+U64OZecUvBj2gh3Au1MNcfesb1RQHtLlvdL/HIe+vSUvgTXgxT4ajlGRy3TYTOHltdIYyQQGUEIKvx/xECEwBHBT2JoAJKXIBUoINcUIgoQQ7UwlxIUAFGUOLJWRaeRgHtC0LAbLZ4bvsyaNFDvAA9sKB6FQlCgk0AB299UUD7SEVFpXc+KAQOYkKClT+OpPo9s9lCe44Q4nEUM74goTt3hJC6UUC7gY/hCZvNk3cKCSHBgALaDTabjXMvWCikXU8IuTNKCTcYDAZuGzBbERERzk9jCCFBiwLaDQajkdsGbICigZyfxhBCghYFtBvKSrVguAxxGKxo3Lghfw0ihAQlCmgXaXXXk7Q6HeftNFFH2nloDiEkiFFAu8hms4VVVFZCIua260QioZeeVCGEBCoKaBcZjaZmRqMFQoGAw1bMiIpqsp63RhFCghIFtIuqqowttboKjluRICI8/E9eGkQICVoU0C6qqKzsWK51fwzabLECjAgNGyr38tgsQkgQooB2kcFQFaepNEEidn8WR1yrplAqGuTw2CxCSBCigHZRWZmmP4x3qhJ+Z5pKE/r37c5jiwghwYoC2kWXLhdyuTsIGK24u3NHnlpDCAlmFNAu+u3gYUDGrQ5Hp47taA40IaROFNAuunK5yO2nCM0WK1QNGTRvHpXFc7MIIUGIAtoFWt31pOJrZZC5GdA2ux0d2rZEl07tJ/HcNEJIEKKAdsHlK0VP5V8qcvv9OoMZd3XpwGOLCCHBjALaBb8fPZ6hKTe4P8XOaMV93RP5bRQhJGhRQLsg9488TjcI1Wo5evbolsljkwghQYwC2gXf//ArFIzErfcazRa0bhWNFs2bfchzswghQYoCup5O5J1edfTAGcgkYrfer9NUYfjQgfQEISGk3iig6+n3o8czwHCb/9z7wZ65PDWHEBICKKDr6bP1m8HIpW69V28wYVDKvejSuX0Gz80ihAQxCuh6KL7Kpn239SDkjHsBbdCb0Kf3fTS8QQhxCQV0PWz/dvdGwL2ns80WKyATYeiQh2j2BiHEJRTQ9bD92x/AqBm33ms0W/HIgAfo6UFCiMsooOtwIu/0qi3ZO90f3mB1GDN6GM+tIoSEAgroOqz57IsMRIS59V6zxYoOCW0wIKUPFYAmhLiMAvoOiq+yaWs2bIVK6d7whqZQj6czxtLNQUKIWyig72D7t7s3Fp5j3a+9wYgw9rFHUvltFSEkVFBA10Kru57E5eYgW6rH3NlPQx3ZaDvPTSOEhAgK6FpcvlL01J5fcty+OQiJCOPHPjqT31YRQkIJBXQtTuadztAU6t16L8vq8fKz49AqtsW7PDeLEBJCKKBrcfjIH0CE62PPZosVca2aYvKk8dR7JoRwQgFdi9NnLoAJd314Q1NuwLRnHqfeMyGEMwroWhgMlS6/R28woX+frnh83MjeHmgSISTEUEDXgmHCXXq92WKFTCLCvNdfzG2oUv7soWYRQkIIBXQtuiclwFBpqvfrNYUVWDz/ZdzfMzHBg80ihIQQCuha9H6wZy5s9XstW1CCuW89i/QJjwk82ypCSCihgK7F/T0TEx4Z2htsae1T7YxmC9iCS5j71vOYPWsahTMhhFcU0Hfw3jtzZsbFNAXL6h11neEYa2Z1BrAFJWgdE40d32+yUzgTQjxBYLe7V4g+VORfvDxj2YqsxdlbdqBcp0dUZEP079sdA1P6YEBKn+5UCIkQ4ikU0PXElpQNsVqtETKZtIhmaRBCvOH/ASXjQGXUJ5XJAAAAAElFTkSuQmCC";
// variante clara (texto branco + traço rosa) — usar sobre fundos escuros (sidebar, login)
const LOGO_YME_LIGHT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAADMCAYAAABeHzmZAAAdxElEQVR4nO3de1BUV54H8N9tXiZKtw9aUDFoHBkJs5hVMcZREwMxOwXOgwnGZJNZd9DM1GoNNSuzpVvjPkJF3BrdsRPcmYl0wmysQHCkpqLWVAzE8RFj5DGBjZpojDiiPBqQ7hahefTdP+g2iDz6dp97z318P1W3ykdz+vSl+9vnnnPuOYIoigRsOV3uVCIiizm6inddRuKv31jUWnel+c+V1+ud0N8/YB4YGJg49P/DwsK6wsPDXCaTqYcI502qkd6LOIdfE0YL6PMXL+0/+0ntxpwN64mIKL/ARnPnzKb0p1Y+FxdrLVOyklrQcK1xa+Xx07v958vPVmin9LSVRclJiZuUrI+jrSPj2l8bf97R0fnU9cabgqOtnbblbZZczq7d+8gaM43M5kk0a+aM+ofnPvSqHn//Tpc79fKXVwuuNvw1zeW6TTebWmjH9tygyvKfs9nxM8VZs+Ls8bNmvGHU0HG63KmNN5pevnGjOUfq+3Doe2/unIcqEx6K/7U1ZupRmausLqIo3nNcbbi+VRzHKzv3isN/zqhHp9OVOt758vOdW1nq8NHH1XV7Xy8KtCpMFPyqUHz/gxPeVkd7hhyvS86j1dGeUXbosP+9rIhXdu4Vyw4dFpuaW9cp8Rp5HFcbrm99+51DLE/biIreKhE/u/DFft6vV+7jnr989HF1nZSTpMUPJssjkC+z4So+PHU71OflFcjjeWXnXrHiw1O3fV9a3H8/ww+1nTO1n69Ajo5bnSvf/+CEV47zI0XZocOyNYB4Hnf/UFVTVxHMiTFqSPtaQUEJ5pu/qbl1nRItE5bKDh0WO251rhQ5/p6qauoqlGwlh0IrVyOdTleqGkJ5NGWHDusml4b+JRTcXwiHI1TjPkeroz1DzR8EKXwNAEV+N03NrevKDh1W6qXJQsnzFehxteH6VjVdgYznlZ17Nd8NQqIYfOvZT41vJjkP37dzSMZ64zQ1t67T0gdBirJDh0W5LumbmlvXFfyqUNHXIzffFzTX97vvvappvu5b7tkh9SBRFCnUMPD9PPcXo9QR6heaKA4Ocgwvt9XRnqHXYB6u6K0SZt0fVxuub9VKN0aweLQE9RDMw2mtMen/AwvcX4xSh2+gj+k501r/Miu+roigfg+tjvYMvQfzUK/s3Cvb1cfQo6m5dZ3ez6tWBhT9fwiZlkeipR4M+zdDGmzUE6mtaaNcaYxEzst135WdIex9vUj1uWUK5K4ykMf5i5f2x8Va3+VdDzWYMtly8vzFS/vHe1zl8dO3iUjM3ZKjQK3UafmyxSm2QjvTW4B9514cfqOVnuVuySGLOfqc7z2lSqbu7p65LArq7e2bzqIcLfB4epmUk5yUuJFJQTqRnJS48WD5kRGDp+Fa41YiEtNWr5g40v8bje8LKuSQdrrcqbZCu2jk96LvPSXe6nSu5F2X4Uw9PZ7ZLAoavkYBQDCyszJp1+59ov/Kzulypx4oKRfnJMTv5l03lRKDvQpuuNa41WKOPmfkq5Ghpky2nKyura/gXY+hTG3tHd/hXQmtYdWChpFty9tMFnP0ufwCm2gxR5978fks3lVSNYs5+pzUn6k8fvo2vvTut2RRStqBknLVrCBn6u3ts7IoiFVLHMAv2MWKjEhKn7S9uBRdRWN48fksyi+wBX1lwpLp9u2uv+FdCQAITe6WHDpWcdI73uPyC2yGGggM1o7tuWQxR59ztHVk8KyHyelyCTwroEW3b3fxrgLAfdakrxKaWxzrxniIiKsSaawxU48EMrtILiZeTwwA7I00bdN3qa6aflWtSU5K3Mhr8DAcA17GYSu007RpUygqKpIsZvPdD6zT5RI8nl5qb79FGNEflF9go5kzYikqKpKioiLv+T+1n6vq2vqKJYtS0okGwzmYQUQl+Bfk959fj6eXgt1YQm5LFqWkDT2vSglX8slAGfbiUlqY8khl/KwZbzzwwISr/t08pASK0+VO9Xq9E5xO99KbTS0/+urqtZSrDdd1N3BnLy6lpAXz6x+e+9CrQ8+VlNfpdLlTe3v7prc62r7/l08/28h71smSRSlp/nqpIZwPlJTTgm9+ozLhofhfR0ZGtPrP8XhBrMbzev7ipf2K7o7E6tZOrdzbzuJQ223GZYcOK7qYTsetzpVVNXUVWlw/pOitErGqpq5CqTUteJ0nngtIyXmOO52u1Kqaugqet6QrmXUI6CAONQS0mhZ3928fpVZ7Xy9SxbrAWtx0QQoeK8WxWFkyGEptW4aADuLgFdBvv3NI9TtFMFzpL2QstheT61DzF5oURW+VqOI9yWOpXiWuwpgFtJ43whx+KP1GCGVJTl4Hz4XztdJYkLLhsNqMtJ65Go5OpytV4e4PWV8Pptmp2K7d+8jpci/NzsrU3Fz1bXmbhYPlRxR9zoZrjXlEJMxJiN+j6BMHyTdYpvh5CkV+gY2aWxzP5WxYr8r3pMUcXZWzYb3Q3OJ4TonnY72q4H3QgpZ+KNGCVvPluZRDiT0V1dC/HOqhhb0ntbYbiSgO7uQuz9n4mpzrczNrQYeFheH2OkYarjXmpa1eMYl3PVhYk77KZCu0y1L2wfIj5HS5lyo67Ukma9JXmdTaks4vsJHT5V6q9BxgFpYvW7zQ0daRKfNzpMh1Szi6OFTG0daRqZVL9EDlbslhfjl8oKScsrMyBf+cWj3IzsoU8gtsvKtxj4PlR2jH9lxNn2drzNSjJHNXkjVmqiyFI6BVpLnF8ZzvzaQ71bX1lSzLe+bpJ2VtFfHy000vqeZ1nb94qUiL4x+jyc7KFFi/D4cKZLEqqRDQKnH+4qWiuFhrGe96yIX15XFkZEQry/LUwhoz9eiBknLe1SBHW0emHrqOhluyKCVdrgHENemrBNa7sjALaOyoErwDJeWkxw/DcHK2XvSE99WB0+VeqtcrOSKiuFhrmdPlXipH2YW/KT7Jsjy0oIPQ3dPDtLy1GU/L8mZRm/nfmLuddx20gGc4Ol3upVrubw6UxRxdJcfg4Y7tucRy5TsENGeVx093GeEDQTT4oVDbIJha8ZjRYZRw9rPGTD0qR3eHf7EqFhDQnC1ZvHA17zoo6bHUv2UysV/vu8inLn40T8nna7jWmGekcPaLi7WWnb94qYh1uZXHT99mUQ4CmiNboZ2M9qGYNSuOyaRovY95TJliYdqXOZYzZ2vq9Ta1U4rkpMRNlcdPM72Pg9WejwjoIPT19TMp59vLUw03aDbdGvNH3nXQAqW+uO3FpbR82eKFSjyXmqWtXjHJXlzKtEwWrWgEdBBYLVqvxTuzQF/UuqYGD6zPBYtWNAIaFBUeHubiXQcYJEffq9axHjQMdcNZBDRoUk+PZzbvOshNzhkvtkK7IebeSxUXay1j2dWRnJS4MZSfR0ADqJSc+z++sP4HqrmlXG1Yd3X4dlUPCgI6CJjLC1pmLy7lejOMFrCch36s4kTQG/cioAEMJuM7aYosZq9la9KfYHZ3b3ZW8BcrWA86COZoXSzVDAal50W5WLGYo6tYLlrV3OJYF8zPoQUNiurvHzDzroORnTlbU8+7DlrBctGqUx998m4wP4eABk3qunNnAe86aFHyI6HNKjASlv30wXZzIKABDMRoSwuEiuUt4MHM5kBAB4H1cqMASmB9K7MRJD/yzR+zKuvyl1cLpP4MAhoUhTsJ+ZmTEG+YgXxWWA6ofnSmSvIypAhoAIOIi5tewrsOWrRr9z4m5eRuyZH8MwhoAIPw3XYs4pB2bMvbHNT5HonUPQuZBTQuXQEAxuZ0StsLES1o0KTu7p65vOsAINXNppYfSXk8AhoAQCE3bjalSHk8AhoAQCGff3FF0uMR0AAACpG6hCwCGgBApRDQAAAKknLLNwIaFIXV7MDovF7vhEAfi4AOQl9fP+8qGF5vb5+Vdx0AgiGlkYKABgBQ0MDAwMRAH4uABgBQKQQ0KEpK6wHA6JgFtMlkwiLJAAAMoQUNAKAgKRtsI6ABABQUGRnRGuhjEdCgSd3d3fN410Fu+QU23lUAzhDQACpljp7EuwrAmK3QLmnjXgQ0gEpNmsRmwsuZszX1RCTg4H/kbskRxvt9DYWABkX19Hhm866DVrDa5LWq+lNJaxCDeiCgAVSK1SavwWxWCuqAgA6C1DVdAYIx3RrzR1ZlNbc41rEqC5TDLKCldHwDwPisMVOPsirr/IUv3mRVFigHLWjQpIEB74O866AlaatX4BZ7DUJAA6iYrdDOrCwpC8WDOiCgAVQsacF8kVVZ1TV1x1mVBcpAQIOiJkyIus67DlqSOP/hX7AqC90c2oOA5mTX7n28qwAaMCchfg/L8hxtHRksywN5IaABVI7lmhzvHTl2hFlhIDtmAY0BCAiElKUWYVDa6hX1rMrK2bAen1UNYRbQUnaqBYDAJT+SuJFleccqTpxjWR7Ih1lAezy9M1iVBfoVHh7m4l0HrWF9E1h2ViZa0RphMpvZLGnY3nHraSYFga5ha7Tg+FakYwataG0wTZ0ymUmf4F8+/YzpZRgAfI11N0d2VibW59AAk8ViPsuioBefz2JRDACMwGKOrrIXlzItc/+b77zLtEBgzhQ/a8YbvCuhJei7A14yvpP2HMvydmzPpTNna+pYlglsmeJirWWsCjt/8dJ+VmWpVXd3z1zedQAip8slaWcKPYiLtZax3qdw+bLFKWh0qBfTG1XOflKr+37oxhtNL/Oug5ZhOmZoXnrhh3msy3xt35sYMFQpExG7FbNyNqxnUo6a/en942m866Bl/f0DZt510LI5CfF7WLeid2zPpQMl5cwWZQJ2TERE6Wkri1gVqOc+LafLnYrdVEIzMDCABXtCtOnHLzDtiyYaHOSvrq2vYF0uhMZERJSclLiJVYHLly3W7QaVh49+gEtB4C4u1lrGekYHEdGSRSlpRhhH0hJZFks6VnHSK0e5PDld7lRMJQwdq129PZ5eFsVo1rNZGUvlKDc5KXEjQlo97gZ05fHTzBaxWZO+StDbyLDFHI3WM6iGxRxdxfIzOxRCWj3uBvSSxQtXsyxYT4F2sPwIBlAY6bpzZwGLcozegiYiSlu9gs06DSNITkrciD5p/u4GtMUcXcV6dFgPwXbmbE1ddlYm72oAjKi5xcF8wNBvyaKUtMrjp2/LVT6M754+aNZzLLOzMjXdH11dW1+h50FP0L64WGuZXF0dRIPbZNmLSzXf0NKqewKa9fY6RIP90VpsSR+rOOldsigFc55VKioqkncVVCNt9YpJLHf/Hs53f4Oot3ElLbhvFsf5i5eYzYn2y87KpPwCm2ZC2l5cKq5JX2W4W4mVMPHBBz/nXQc9yt2SI/v71WKOPqel+xycLndqdW19xcHyI6K9uFS0F5eKB8uPiNW19RWa+bIRRfG+45Wde0W5XG24vnWk51TD0epoz5DthQ9T8KtCUYnXpLbD9/sP2dvvHDLk+RvraGpuXRfSSQ3QKzv3ir7PCvfXPNLx2YUv9gfyOoreKhE7na5U3vUd6xhxHrQcdyr5zUmI320vLlXd5dKxipNea8xUbKipEejiuF9crLWsura+Uu7n2bE9l6wxU4+oreuy4Vrj1vwCm5icFNja2Tkb1pPFHH1O1Tudj5bcZYcOB/IlFJKKD0/dVvLbaKSjqqauQvYXOgKjtqBZtfJ870/ur0eNhxKf3aE++ri6To7XEejR1Ny6jsFVP/ff20jHqHcSZmdlyt6nlbZ6xUQiEnlM5fHN8RQxEKgsVrt6W8xmVbXe1CQ7K1PYtXufYs/nm+kkKt0/3dziWLdr9z4xLtb6bqhr5Kh1ttmYt3o72joUmQDsD+oDJeXirU7nSrme51anc6Vv1S4Es8ZNmjTx/3jXQc225W1WfJDbH9T24lJRzu20zl+8tD+/wCbGxVrf3Za3mUmZqp0UMF4Tm1cXwNvvHBI/u/DF/lA68TudrtSqmroK34CSqhi1i8P3+wyZ733J/fVo4OCq6K0S8aOPq+t8XVtBvYarDde3Vnx46vbe14tkrasaBwwFURz/SvFASbnIe6GgXbv3UfysGTQjbnpXXNz0kuHTtbru3Flw40ZzzvXGm8LNphZS+7Kgu3bv49LK4c3pcqeyWAagucXxHMvdgHROVd1Bu3bvI2vMNDKbJ93TVeV0uQSPp5fa229R7pYcxeulxvdUQAFNRGQrtIs8TppeGTWgfVgEhlHPnWROlzv1tX1vnlN7o4U3NQZ0wMuN5m7JEViv1QEA8rOYo6t2bM8V5LzbUA8eeGDCVd51GE7SetA7tucqOjoM+nSwHNPNecjdkiPIsdC/XljM0VW86zCc5AX7t+VtxjcxhCR18aMhLcqFgA9ezob1wrGKk6rqk1YDtWZaUDuq5G7JEfAhgWCFuijXmvQnZNlNxCjWpK8yybHmjpZ9b+0zzHdLZyHoLa+yszIF/JIhWMGuY1x5/HSXGi9FtSY5KXGT0+VeinElIntxqSwrebIQ0p6EyUmJm5S6mQX0JS7WWib1C95eXCrrLiJG4x88NHqXR86G9aqdERTyprHWmKlHiQhdHiBZclLipkAX97EXl6r6g6Rla9JXmeTcmUWtfP3Oqn5PMdvVOzsrU2i41qjKfhyWGq415uGykJ0li1LSHW0dmWMN0lTX1lcinOXlm/9rmIbWmbM19UqsoR0qZgFNdHfwRzhztqaeZblq4HvjCnMS4vdERITzro6uWGOmHs3dkiPc6nSuqq6tr6w8frrrzNmaet8XvrBkUUo67zoaRXZWpuBo68jU63RaW6GdnC730uXLFi/kXZeAyHkfudLLHsph7+tF992j71tHIyRGXYsDh3YOVpsrqIWaNwsZ7WDagh7Ot2SpJgchbIV2crR1ZOZuyREwawCMyH9FrPWuS99gtKDWmRpjkTWg/dakrzKRRoL6QEk5OV3upblbcgTfACiAoQ0Nai11ffiDOTkpcRPvugRLkYD28wf1+YuXitT2iz5ztqbe6XIvffH5LLSYAUYwJyF+z7a8zYKjrSNTrYOJB8uP+OfYazqY/RQNaL/kpMRN2/I2C06Xe2nl8dNMdtgIxrGKk6JvHrewfNnihQhmgPFZY6Ye9XdfqqGxZS8uJf+AcnZWpqC2FelG5SELdYrzqFOcRx6yjPQQrtMRLOboKv+NB06XO/Xyl1cLPv/iyzS51p62F5fSwpRHKuc9nPCfUyZbTq1JXyXL8wAYRXJS4ibfXYmpjTeaXr5w8dLG7Cx5712zFdrpW8nf7Jr38Jx/n5MQvydnw3pZn4+5K961dKb/P6hN/Ba1ioO7H08kogRTLT0Z/s8023TC/9CA14NWmtPlTr11y7nqZlPLj6qqP02Ruha1vbiUkhbMr585I/Z/p0yxnGTZOt61e58Y6lY7Bl8PGgygucWxrr3j1tM3bjTnXPz8siD1M5xfYKOZM2Jl+xwrziGm0KHeP1G9dyYREYUN+/8B37/9fcQvaVn4q0QqDujxOF3u1N7evumRkRGtSv/SENAAIMkV71oq6n2PnOJgCI/WueylwaDeHvUkzTad0OwdF5r+JgUA47jiXUt7Pe8REVHEOI810WBA/6HvGP08KorLICEAgCF4yELFvYPhHGjaRhDRZW8kOcQUBDQAgFzKej+kdjG4+XJfDWQgoDl5YMIE3lUAADl90r+dPh5YNG63xmhclICABgBg7Yp3Lb3Tt/O+mRoSIaABAFhyiClU1PseeSm0hA0jDwIaAIAVh5hCr3nqyBlkv/NQCaYKBDQAAAv+cG4Xx59ONxYvEVkEonjTSQQ0AECornjX0n976qgzxHAmGpwH/XjYHyiKnJq9UQUAQBUuDLxIv+t9O+Q+Z6KvW8/PRGwk4rxYEgCAZnnIQif7/4ve6/sJEbEJZyKilyJeoihyEiGgAQCkG7rw0Vhra0gxQER/F/4HeiTsgP+fENAAAFJ80P9bOtL3E+qj0Pub/fqIaL6pl74bkT30nxHQAACB+KR/O/2xf+fdFelYhbO/3/nFyNTh/4WABgAYTac4j2oHfkZn+n9GNxkHM9G9/c5WoX74fyOgAQCG6hTn0U3v41Qz8HO64F3EvMU81AARPRvx2tB+56EQ0ABgbB6yUKv3UbrhXUHnvf9ADd751O7byESuYCYa7Hd+KuwYPRWeO9pDENCcdPf08K4CgLH4N2Z1iQn01UAGtYiLyCEupCbvfGoRB1uzRPKGsl8fES0Ou0zPRj4z1sMQ0EHAUqEAKuUhC3WLMeQW48ktziaXmECN3lXUJn6L2sSZ1EVEzmHb/PlXnJM7lP384ZwTmTjeQxHQAKBuw0PXLc6mLoqjAYoip3cuOWkuucQEahUj6faQlvBwSgfxcP79Bh8Pq6WXIhcH8iMIaL1yiCn01UAGXfc+Sd0Uw7s6YAAPUBtFCq6v/y60Uxh5aICiqFucdvffe0UzERF1Uwz1UjT1iRPvvke7xEgiIvIQUT8R3fG1dvvGee6h6y7zCuCx+MP5BxG/o6fDfxrojyGg9aZTnEcVff9DpwbWjPumBlCTsRa3Z3W3Hg99NDjP+fvh/0qPhRdI+VEEtJ44xBT6nadOlvmaACCNv9U839RLz0asodmmE1KLQEDrhYcsd8MZwQzAl/828CfCjtHayHX+xY+kQkDrxft9RQhnAM6Gtpq/G/EszTMdDqU4BLReVPY/G+oGlQAQJH8wWwSi74X/kpaFv8qiWAS0Hlz3PsF0ZS0ACMzQYH46/DX6dvi/BdudMRIEtB64xdm8qwBgGP5QJiKaKRAtZx/MfghoPYgSmL8xAGCIoaEcQUSPhl2mx8NeoXlhh+UIZj8EtB7Em05SBBGTPdEA4OtlQP2hbBGIpgu9d0N5hKVB5YCA1oMoctKSsFr6eGARAhogCMMDOYyIJglE3zBdpmTT75UM5aEQ0HqxNmIdVQ98iVY0QACGdlkQfR3I04VeWhj2W0owVdA04QJNFq5wqiERIaD1Y7JwhX4S+RL9pvdtzOgAoK9bxUT3L6BkEYgShJs003SGYoVaejjsKI8W8ngQ0EFQ7VrOj4QdoH+Juk6/7/0z3Ryy4DiAXo22ch3Rva3i2cKfKd50kqymejW0jAOFgNab2aYT9IsJk+nT/n+iz7z/SC4x4e4KYQBa5SGiqCF/nyj0EtHgCnoRQhdZ6CpFCi6aJNykOKGKrKZ6iqAuekBok3OWhdwQ0Jz09fXLV3gUOemx8AJ6jAru7iIBoDcaDt5AIaA52bF91G3I2DLAmxhArzDeHwRZW78AAD4IaAAAlRJEURz/UTAcq5MmMCoHAHQILWgAAJVCQHOSX2DjXQUAUDkENCfm6Em8qwAAKoeA5mTatCm8qwAAKoeAlsjpcqeyKGe6NQajswAwJgS0RF6vdwKLcsLCTHdYlAMA+oWAlsjj6Z3Bopy4uOklLMoBAP1CQEvU0+Nhsv/fxAcf/JxFOQCgXwhoibru3FnAopwpUywnWZQDAPqFgJaou7tnLotyLOboKhblAIB+IaAl6ujofIp3HQDAGBDQEl1vvBny+hm2QjuLqgCAziGgJcrZsD7kMpIWzMccaAAYFwKag1mz4tCEBoBxYblRCZwud6rFHH2OQVFYZhQAxoUWtASNN5pe5l0HADAOBLQEf/n0s42hlmEvLmVRFQAwAHRxSBPyyTp/8VJRclLiJhaVAQB9QwtaYfGzZrzBuw4AoA0I6ACdv3hpf6hl7Nq9D3cQAkDAENABYtH/vGrFsnoWdQEAY0AfdOBCPlFOl3spWtAAECi0oAPQ3OJYF2oZ6N4AAKkQ0AE4+qfKd0MtY23G00Us6gIAxoEujsCwOEm4exAAJEELehwsZm8cLD/CoioAYDBoQY8Pg4MAwAVa0GNgMThoK7RjcBAAgoKAHgOLwcEX1v8gk0VdAMB4ENCjcLrcqaEuzp9fYCNrzNSjjKoEAAaDgB4Fi6VFX3rhh3ks6gIAxoSAHsWFi5dCvrV7TkL8HhZ1AQBjwiyO0YV0YhquNeYhoAEgFGhBy8BWaEfrGQBChhb06II+Mbc6naumTLacYlkZADAetKAZO3O2ph7hDAAsIKBHsWv3Psk/Yy8upeXLFi+UoToAYEAI6FFIXVw/v8BGORvWY0EkAGAGfdBjC+jk5BfYaMf2XIQzADCFFvQYGq41jnujybGKkyLCGQDkgIAew5yE+D2jhfTB8iPkdLmXrklfhXMIALJAF0eAHG0dGQMDAxOjoiKbMEsDAJTw/1iw0egIaSjvAAAAAElFTkSuQmCC";

/* ---------- design tokens (paleta YME: azul-marinho + rosa) ---------- */
const C = {
  bg: "#F4F5F9",
  panel: "#FFFFFF",
  sidebar: "#0F172B",
  sidebarSoft: "#1B2542",
  ink: "#131A2C",
  inkSoft: "#5B6478",
  line: "#E5E7F0",
  accent: "#E6178C",
  accentSoft: "#FCE3F1",
  gray: "#8A93A1",
  grayBg: "#EEF0F3",
  amber: "#B8791A",
  amberBg: "#FBF0DD",
  teal: "#256B79",
  tealBg: "#E1EFF1",
  green: "#2C7A54",
  greenBg: "#E2F1E7",
  red: "#B0394A",
  redBg: "#FAE5E8",
  // gradiente inspirado no cartaz do concerto — azul-marinho a rosa
  gradient: "linear-gradient(135deg, #10102A 0%, #4A1B63 45%, #E6178C 100%)",
  gradientSoft: "linear-gradient(135deg, #1B2542 0%, #3A2555 55%, #E6178C 140%)",
};

// gradiente azul dedicado à página de Dashboard — distingue este módulo dos restantes (fundo claro)
// mantendo a identidade visual: parte do mesmo azul-marinho da sidebar e evolui para um azul mais vivo
const DASH_GRADIENT = "linear-gradient(160deg, #0B1229 0%, #0F1E42 30%, #143869 58%, #1E4F91 82%, #275FAE 100%)";
// brilhos subtis nos cantos — o rosa mantém o fio condutor com o resto da plataforma
const DASH_GLOW = "radial-gradient(circle at 12% -6%, rgba(230,23,140,0.20), transparent 42%), radial-gradient(circle at 92% 108%, rgba(94,180,255,0.22), transparent 45%)";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

/* Em ecrãs estreitos, os formulários de duas colunas passam a uma só: com
   ~350px de largura, dois campos lado a lado ficam demasiado apertados para
   escrever um email ou um nome de agência. Está aqui em CSS, e não nos estilos
   inline de cada modal, porque são oito grelhas espalhadas pelo ficheiro. */
@media (max-width: 859px) {
  .form-grid { grid-template-columns: 1fr !important; }
  .form-grid > * { grid-column: span 1 !important; }
}

/* O Dashboard usa grelhas de 2, 3 e 5 colunas fixas para os cartões de
   indicadores e gráficos. Num telemóvel, cinco colunas tornam os números
   ilegíveis; passam a uma ou duas conforme o espaço. */
@media (max-width: 859px) {
  .dash-grid-5, .dash-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .dash-grid-2 { grid-template-columns: 1fr !important; }
}
@media (max-width: 520px) {
  .dash-grid-5, .dash-grid-3 { grid-template-columns: 1fr !important; }
}

/* O nome abre a ficha do contacto — sublinha ao passar o rato para se perceber
   que é clicável. */
.nome-clicavel:hover { text-decoration: underline; text-underline-offset: 2px; }
.nome-clicavel:focus-visible { outline: 2px solid #9AA6FF; outline-offset: 2px; border-radius: 4px; }

/* As tabelas já deslizam na horizontal; este toque evita que o dedo arraste a
   página inteira enquanto se percorre uma tabela larga. */
@media (max-width: 859px) {
  .tabela-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; }
}
`;

// fonte serifada elegante, usada nos títulos de destaque (ecrã de boas-vindas)
const SERIF = "'Playfair Display', Georgia, serif";

// estilos de hover para o board de templates (cartões e botão de adicionar fase)
const BOARD_CSS = `
.tmpl-card { transition: box-shadow .15s ease, border-color .15s ease; }
.tmpl-card:hover { box-shadow: 0 4px 14px rgba(21,26,36,0.08); border-color: #D8DCE2; }
.tmpl-add-btn:hover { background: #FFFFFF !important; border-color: #C7CCD3 !important; }
`;

const ESTADOS = [
  { v: "Por contactar", color: C.gray, bg: C.grayBg, icon: HelpCircle },
  { v: "A aguardar resposta", color: C.amber, bg: C.amberBg, icon: Clock },
  { v: "Pediu mais informações", color: C.teal, bg: C.tealBg, icon: Mail },
  { v: "Positivo / Disponível", color: C.green, bg: C.greenBg, icon: CheckCircle2 },
  { v: "Confirmado", color: C.accent, bg: C.accentSoft, icon: Sparkles },
  { v: "Recusado", color: C.red, bg: C.redBg, icon: XCircle },
];
const estadoInfo = (v) => ESTADOS.find((e) => e.v === v) || ESTADOS[0];

// estados que representam uma resposta efetiva do contacto (usados para os indicadores
// "Contactados" / "Responderam" / "Não responderam" no topo dos módulos de Artistas, Espaços e Parceiros)
const ESTADOS_RESPONDIDOS = ["Pediu mais informações", "Positivo / Disponível", "Confirmado", "Recusado"];
const ESTADO_NAO_CONTACTADO = "Por contactar";
const ESTADO_AGUARDAR = "A aguardar resposta";
const ESTADOS_FINAIS = ["Confirmado", "Recusado"];

// Fases atribuídas manualmente pela equipa, para organizar o trabalho. Não
// confundir com `faseFollowup`, que a plataforma calcula a partir dos e-mails
// enviados — esta é uma etiqueta livre, definida na ficha de cada contacto.
const FASES = [
  { v: "Fase 1", color: C.teal, bg: C.tealBg },
  { v: "Fase 2", color: C.amber, bg: C.amberBg },
  { v: "Fase 3", color: C.accent, bg: C.accentSoft },
];
const faseInfo = (v) => FASES.find((f) => f.v === v) || null;

// ---------- utilitários de apoio ao trabalho diário (destaque de contactos a precisar de atenção
// e ordenação rápida das listas de Artistas / Espaços / Parceiros) ----------
const hojeISO = () => new Date().toISOString().slice(0, 10);

// contacto com o seguimento/follow-up em atraso: já passou a data prevista para o próximo
// contacto e o contacto ainda não chegou a um estado final (Confirmado ou Recusado)
const followUpAtrasado = (c) => {
  if (!c.dataProximoContacto || ESTADOS_FINAIS.includes(c.estado)) return false;
  return c.dataProximoContacto < hojeISO();
};
// próxima ação prevista para hoje — útil para priorizar o dia de trabalho
const followUpHoje = (c) => {
  if (!c.dataProximoContacto || ESTADOS_FINAIS.includes(c.estado)) return false;
  return c.dataProximoContacto === hojeISO();
};

const SORT_OPTIONS = [
  { v: "nome", label: "Nome (A–Z)" },
  { v: "proximaAcao", label: "Próxima ação (mais urgente primeiro)" },
  { v: "ultimoContacto", label: "Último contacto (mais recente primeiro)" },
];

// aplica a ordenação escolhida a uma lista de contactos (artistas, espaços ou parceiros),
// sem alterar os dados originais nem os filtros já aplicados
const ordenarContactos = (list, sortBy) => {
  if (sortBy === "nome") {
    return [...list].sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt"));
  }
  if (sortBy === "ultimoContacto") {
    return [...list].sort((a, b) => (b.dataUltimoContacto || "").localeCompare(a.dataUltimoContacto || ""));
  }
  if (sortBy === "proximaAcao") {
    return [...list].sort((a, b) => {
      // contactos sem próxima ação definida vão para o fim da lista
      if (!a.dataProximoContacto && !b.dataProximoContacto) return 0;
      if (!a.dataProximoContacto) return 1;
      if (!b.dataProximoContacto) return -1;
      return a.dataProximoContacto.localeCompare(b.dataProximoContacto);
    });
  }
  return list;
};

/* ---------- tarefas ---------- */
const ESTADOS_TAREFA = [
  { v: "Por fazer", color: C.gray, bg: C.grayBg, icon: Square },
  { v: "Em progresso", color: C.amber, bg: C.amberBg, icon: Clock },
  { v: "Concluída", color: C.green, bg: C.greenBg, icon: CheckSquare },
];
const estadoTarefaInfo = (v) => ESTADOS_TAREFA.find((e) => e.v === v) || ESTADOS_TAREFA[0];

const PRIORIDADES_TAREFA = [
  { v: "Baixa", color: C.gray, bg: C.grayBg },
  { v: "Média", color: C.amber, bg: C.amberBg },
  { v: "Alta", color: C.red, bg: C.redBg },
];
const prioridadeTarefaInfo = (v) => PRIORIDADES_TAREFA.find((p) => p.v === v) || PRIORIDADES_TAREFA[1];

// lista fixa de membros da equipa, usada no dropdown de Responsável das tarefas
const EQUIPA = ["Maria Rita", "Tiago", "Ana", "Martim", "Sara", "Jonathan", "Lara Costa", "Lara Leão", "Andreia"];

// ---------- permissões: líderes de equipa ----------
// os líderes têm um nível de permissões próprio: só eles podem atribuir responsáveis a
// artistas/espaços/parceiros, criar ou editar/reatribuir tarefas, e consultar as estatísticas
// individuais de todos os membros no Dashboard. Os restantes membros continuam a poder gerir
// livremente apenas o trabalho que já lhes está atribuído.
// Quem é líder vem da coluna `role` em profiles — é lá que se muda, sem
// passar por um deploy. Esta lista serve apenas de recurso enquanto a equipa
// ainda não foi carregada da base de dados.
const LIDERES = ["Maria Rita", "Tiago", "Ana"];
const isLider = (nome) => {
  if (!nome) return false;
  const papel = papelDoMembro(nome);
  return papel === "lider" || (papel === "membro" && !membrosCarregados() && LIDERES.includes(nome));
};

// rótulos usados para gerar automaticamente as tarefas "Contactar X" a partir dos contactos
const TASK_TIPOS = {
  artista: { label: "Artista", verbo: "Contactar artista" },
  espaco: { label: "Espaço", verbo: "Contactar espaço" },
  parceiro: { label: "Parceiro", verbo: "Contactar parceiro" },
};

const CATEGORIAS_PARCEIROS = [
  { v: "Financeiro", color: C.green, bg: C.greenBg, icon: Coins, desc: "Patrocínio, financiamento direto ou apoio monetário ao concerto." },
  { v: "Logística", color: C.teal, bg: C.tealBg, icon: Truck, desc: "Transporte, som, luz, palco, segurança, catering e meios técnicos." },
  { v: "Notoriedade / Media", color: C.amber, bg: C.amberBg, icon: Megaphone, desc: "Imprensa, rádio, TV, redes sociais e divulgação do evento." },
  { v: "Institucional", color: C.accent, bg: C.accentSoft, icon: Landmark, desc: "Câmaras municipais, universidades, IPO e outras entidades públicas." },
  { v: "Em espécie / Produto", color: C.red, bg: C.redBg, icon: Gift, desc: "Prémios, brindes, merchandising ou produtos/serviços doados." },
];
const categoriaInfo = (v) => CATEGORIAS_PARCEIROS.find((c) => c.v === v) || CATEGORIAS_PARCEIROS[0];

const CATEGORIAS_TEMPLATES = [
  { v: "Contacto IPO", color: C.amber, bg: C.amberBg, icon: Landmark },
  { v: "Artistas", color: C.accent, bg: C.accentSoft, icon: Music2 },
  { v: "Espaços", color: C.teal, bg: C.tealBg, icon: MapPin },
  { v: "Tipografias", color: C.gray, bg: C.grayBg, icon: Printer },
  { v: "Parceiros", color: C.green, bg: C.greenBg, icon: Handshake },
  { v: "Parceiros Divulgação (RSC)", color: C.red, bg: C.redBg, icon: Megaphone },
];
const categoriaTemplateInfo = (v) => CATEGORIAS_TEMPLATES.find((c) => c.v === v) || CATEGORIAS_TEMPLATES[0];

// variáveis dinâmicas suportadas nos templates de email, com um valor de exemplo para a pré-visualização
const VARIAVEIS_TEMPLATE = [
  // Dados do destinatário
  { key: "nome", label: "Nome", exemplo: "Maria Silva" },
  { key: "email", label: "Email", exemplo: "maria.silva@email.com" },
  { key: "responsavel", label: "Responsável", exemplo: "Beatriz Costa" },
  { key: "artista", label: "Artista", exemplo: "Nome do Artista" },
  { key: "espaco", label: "Espaço", exemplo: "Nome do Espaço" },
  // Dados de quem envia — preenchidos com o perfil de quem tem sessão, para a
  // assinatura não ter de ser escrita à mão em cada e-mail.
  { key: "meunome", label: "O meu nome", exemplo: "Ana" },
  { key: "cargo", label: "O meu cargo", exemplo: "Junior Consultant" },
  { key: "departamento", label: "O meu departamento", exemplo: "Human Resources" },
  { key: "assinatura", label: "Assinatura completa", exemplo: "Ana<br>Junior Consultant de Human Resources<br>Young Minho Enterprise" },
];
// substitui {{variavel}} pelos valores de exemplo, para a pré-visualização
const aplicarVariaveis = (assunto, corpo) => {
  const mapa = Object.fromEntries(VARIAVEIS_TEMPLATE.map((v) => [v.key, v.exemplo]));
  const substituir = (str) => (str || "").replace(/{{\s*(\w+)\s*}}/g, (m, k) => (mapa[k] !== undefined ? mapa[k] : m));
  return { assunto: substituir(assunto), corpo: substituir(corpo) };
};

/* ---------- lógica comum de comunicação (partilhada por Artistas, Espaços e Parceiros) ---------- */
// mapeia cada tipo de contacto para o rótulo da variável específica ({{artista}}/{{espaco}}/{{parceiro}})
// e para a categoria de templates sugerida por omissão
const TIPOS_CONTACTO = {
  artista: { label: "Artista", varKey: "artista", categoriaTemplate: "Artistas", icon: Music2 },
  espaco: { label: "Espaço", varKey: "espaco", categoriaTemplate: "Espaços", icon: MapPin },
  parceiro: { label: "Parceiro", varKey: "parceiro", categoriaTemplate: "Parceiros", icon: Handshake },
};

// substitui as variáveis {{...}} de um template pelos dados reais de um contacto (artista, espaço ou parceiro)
// `remetente` são os dados de quem assina o e-mail (nome, cargo, departamento).
// É o responsável atribuído ao contacto: o e-mail sai em nome de quem trata
// daquele artista, mesmo que seja outra pessoa a carregar no botão.
const aplicarVariaveisContacto = (assunto, corpo, contact, tipo, remetente) => {
  const tipoInfo = TIPOS_CONTACTO[tipo] || {};
  // normaliza uma chave de variável (minúsculas, sem acentos) para o preenchimento funcionar
  // independentemente de como a variável foi escrita no template (ex: {{Nome}}, {{NOME}}, {{responsável}})
  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const assinatura = remetente?.nome
    ? [
        remetente.nome,
        [remetente.cargo, remetente.departamento].filter(Boolean).join(" de "),
        "Young Minho Enterprise",
      ].filter(Boolean).join("<br>")
    : "";

  const mapa = {
    nome: contact?.pessoaContacto || contact?.nome || "",
    contacto: contact?.pessoaContacto || contact?.nome || "",
    email: contact?.email || "",
    responsavel: contact?.responsavel || "",
    artista: "", espaco: "", parceiro: "",

    // Dados de quem está a enviar, para a assinatura
    meunome: remetente?.nome || "",
    remetente: remetente?.nome || "",
    cargo: remetente?.cargo || "",
    departamento: remetente?.departamento || "",
    assinatura,
  };
  if (tipoInfo.varKey) mapa[norm(tipoInfo.varKey)] = contact?.nome || "";
  // Nenhuma tag chega ao destinatário: as que não têm valor são removidas em
  // vez de ficarem à vista. Antes, um contacto sem responsável atribuído (ou
  // um responsável sem cargo preenchido) deixava "{{cargo}}" no meio do texto,
  // e bastava um envio distraído para o e-mail sair assim.
  const substituir = (str) => (str || "")
    .replace(/\{\{\s*([\wÀ-ÿ]+)\s*\}\}/g, (m, k) => mapa[norm(k)] ?? "")
    // Uma linha que ficou vazia por causa de uma tag removida não deve deixar
    // um espaço em branco a meio do e-mail.
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .replace(/\n{3,}/g, "\n\n");

  return { assunto: substituir(assunto), corpo: substituir(corpo) };
};

// converte HTML simples (do editor de templates) em texto simples, para usar no corpo de um mailto
const htmlParaTexto = (html) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = (html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<li>/gi, "• ");
  const texto = tmp.textContent || tmp.innerText || "";
  return texto.replace(/\n{3,}/g, "\n\n").trim();
};

// abre o cliente de email por omissão do utilizador, já com destinatário, assunto e corpo preenchidos
const abrirMailto = (destinatario, assunto, corpoTexto) => {
  const url = `mailto:${encodeURIComponent(destinatario || "")}?subject=${encodeURIComponent(assunto || "")}&body=${encodeURIComponent(corpoTexto || "")}`;
  const a = document.createElement("a");
  a.href = url;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// constrói o registo de um envio de email, para adicionar à timeline do contacto
const criarRegistoEnvio = ({ template, assunto, corpo, user }) => ({
  id: uid(),
  tipo: "email",
  templateId: template?.id || null,
  templateNome: template?.nome || "E-mail personalizado",
  assunto,
  corpo,
  data: new Date().toISOString(),
  enviadoPor: user,
});

// rótulos e aparência de cada tipo de evento na timeline do contacto (partilhado por Artistas, Espaços e Parceiros)
const TIMELINE_TIPOS = {
  email: { label: "E-mail enviado", icon: Mail, color: C.accent, bg: C.accentSoft },
  primeiro_contacto: { label: "Primeiro contacto registado", icon: Send, color: C.accent, bg: C.accentSoft },
  followup_criado: { label: "Follow-up automático criado", icon: Workflow, color: C.amber, bg: C.amberBg },
  followup_auto: { label: "Follow-up criado automaticamente (sem resposta)", icon: Workflow, color: C.amber, bg: C.amberBg },
  resposta: { label: "Resposta recebida", icon: CheckCircle2, color: C.green, bg: C.greenBg },
  estado: { label: "Estado alterado", icon: HelpCircle, color: C.teal, bg: C.tealBg },
  nota: { label: "Nota", icon: Pencil, color: C.gray, bg: C.grayBg },
  tarefa_concluida: { label: "Tarefa concluída", icon: CheckSquare, color: C.green, bg: C.greenBg },
};

// aplica os efeitos automáticos de um envio de e-mail a um contacto: regista o evento na timeline,
// marca "A aguardar resposta" e inicia (ou mantém) a fase atual do fluxo de seguimento/follow-up.
// Função central e única para aplicar o efeito de um envio de email, para nunca haver dados divergentes.
const aplicarEnvioEmailContacto = (contact, entry) => ({
  ...contact,
  historico: [entry, ...(contact.historico || [])],
  estado: "A aguardar resposta",
  aguardaResposta: true,
  dataUltimoEnvio: entry.data,
  dataUltimoContacto: entry.data.slice(0, 10),
  faseFollowup: contact.faseFollowup || 1,
});

const MODULES = [
  { key: "artistas", label: "Artistas", icon: Music2, active: true },
  { key: "espacos", label: "Espaços", icon: MapPin, active: true },
  { key: "parceiros", label: "Parceiros", icon: Handshake, active: true },
  { key: "templates", label: "Templates de Email", icon: Mails, active: true },
  { key: "tarefas", label: "Tarefas", icon: ListChecks, active: true },
  { key: "documentos", label: "Documentos", icon: FileText, active: true },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
];

// Largura a partir da qual há espaço para o menu lateral permanente. Abaixo
// disto (telemóveis e tablets em vertical) ele passa a abrir por cima do
// conteúdo, senão ocupava metade do ecrã.
const LARGURA_MOBILE = 860;

/** Verdadeiro em ecrãs estreitos; acompanha rotações e mudanças de tamanho. */
function useEcraEstreito() {
  const [estreito, setEstreito] = useState(
    typeof window !== "undefined" ? window.innerWidth < LARGURA_MOBILE : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${LARGURA_MOBILE - 1}px)`);
    const aoMudar = (e) => setEstreito(e.matches);
    setEstreito(mq.matches);
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, []);
  return estreito;
}

// Identificadores no formato UUID, exigido pelas colunas `id` da base de dados.
// A versão anterior devolvia texto aleatório curto, que o Postgres rejeitava:
// tudo o que fosse criado na plataforma falhava ao gravar, sem que a lista no
// ecrã o mostrasse.
const uid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // Alternativa para browsers sem crypto.randomUUID (ou em contexto inseguro).
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};
const blankArtist = () => ({
  id: uid(), nome: "", agencia: "", pessoaContacto: "", email: "", telefone: "",
  responsavel: "", estado: "Por contactar", fase: "", dataUltimoContacto: "", dataProximoContacto: "",
  observacoes: "", criadoPor: "", atualizadoPor: "", historico: [],
  aguardaResposta: false, faseFollowup: 0, dataUltimoEnvio: "",
});

const blankSpace = () => ({
  id: uid(), nome: "", cidade: "", pessoaContacto: "", email: "", telefone: "", capacidade: "",
  responsavel: "", estado: "Por contactar", fase: "", dataUltimoContacto: "", dataProximoContacto: "",
  observacoes: "", criadoPor: "", atualizadoPor: "", historico: [],
  aguardaResposta: false, faseFollowup: 0, dataUltimoEnvio: "",
});

const blankPartner = () => ({
  id: uid(), nome: "", categoria: "Financeiro", contributo: "", pessoaContacto: "", email: "", telefone: "",
  responsavel: "", estado: "Por contactar", fase: "", dataUltimoContacto: "", dataProximoContacto: "",
  observacoes: "", criadoPor: "", atualizadoPor: "", historico: [],
  aguardaResposta: false, faseFollowup: 0, dataUltimoEnvio: "",
});

const blankTemplate = () => ({
  id: uid(), nome: "", categoria: "Artistas", fase: 1, assunto: "", corpo: "",
  // número de dias a aguardar, sem resposta, antes de a plataforma criar automaticamente
  // a tarefa de follow-up da fase seguinte (ver DEFAULT_FOLLOWUP_DIAS)
  intervaloDias: DEFAULT_FOLLOWUP_DIAS,
  criadoPor: "", atualizadoPor: "", criadoEm: "", atualizadoEm: "",
});

// intervalo por omissão (em dias) do fluxo de follow-up automático, usado quando uma fase/template
// não define explicitamente o seu próprio "intervaloDias"
const DEFAULT_FOLLOWUP_DIAS = 10;

const blankTask = () => ({
  id: uid(), titulo: "", responsavel: "", dataLimite: "", estado: "Por fazer", prioridade: "Média",
  criadoPor: "", atualizadoPor: "", criadoEm: "", concluidaEm: "",
});

/* ---------- Documentos: repositório de documentação partilhada pela equipa ---------- */
const DOC_CATEGORIAS = ["Acordos", "Contratos", "Financeiro", "Comunicação", "Logística", "Outro"];
const blankDocument = () => ({
  id: uid(), titulo: "", categoria: "Acordos", link: "", notas: "",
  criadoPor: "", atualizadoPor: "", criadoEm: "",
});

/* ---------- seed de templates (exemplo real já redigido pela equipa) ---------- */
const SEED_TEMPLATES = [
  {
    nome: "1ª fase — Convite inicial", categoria: "Artistas", fase: 1,
    assunto: "Querem participar no concerto solidário da YME?",
    corpo: "Bom dia {{nome}},<br><br>" +
      "O meu nome é {{meunome}} e sou {{cargo}} no departamento de {{departamento}} da Young Minho Enterprise (YME), a Júnior Empresa da Escola de Economia, Gestão e Ciência Política da Universidade do Minho, que atua nas áreas de Design, Web Development e Corporate Consulting.<br><br>" +
      "Na YME, acreditamos que o impacto social faz parte integrante do nosso percurso enquanto jovens profissionais. Por isso, estamos a organizar um Concerto Solidário que se irá realizar em Braga, com o objetivo de reverter todos os ganhos a favor do IPO e assim ajudar aqueles que mais precisam.<br><br>" +
      "Neste momento, estamos a planear o evento para o período compreendido entre (datas).<br><br>" +
      "Desta forma, e porque admiramos o vosso trabalho, gostaríamos muito de contar com a vossa participação nesta causa. Teriam disponibilidade de agenda dentro desta janela temporal?<br><br>" +
      "Caso tenham interesse, estaríamos totalmente disponíveis para uma breve reunião para discutirmos datas específicas e os detalhes do evento.<br><br>" +
      "Fico inteiramente ao dispor para agendar ou esclarecer qualquer questão.<br><br>" +
      "Cumprimentos,<br>{{assinatura}}",
  },
].map((t) => ({ ...blankTemplate(), ...t }));

const normNome = (s) => (s || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// junta uma lista-base com uma lista de novos registos, sem criar duplicados (comparação pelo nome)
const mergeByNome = (base, extras) => {
  const existentes = new Set(base.map((x) => normNome(x.nome)));
  const aAdicionar = extras.filter((x) => x.nome && !existentes.has(normNome(x.nome)));
  return [...base, ...aAdicionar];
};

// procura, numa lista de contactos já existente, um registo com o mesmo nome (normalizado — sem
// maiúsculas/acentos) do nome indicado; usada para avisar de possíveis duplicados ao criar um contacto novo
const encontrarDuplicadoPorNome = (lista, nome, ignorarId) => {
  const alvo = normNome(nome);
  if (!alvo) return null;
  return (lista || []).find((x) => x.id !== ignorarId && normNome(x.nome) === alvo) || null;
};

// exporta uma lista de registos (já convertidos em linhas simples, com os cabeçalhos em português)
// para uma folha de cálculo Excel (.xlsx), transferida de imediato para o browser do utilizador
const exportarListaExcel = (nomeFicheiro, nomeFolha, linhas) => {
  const ws = XLSX.utils.json_to_sheet(linhas && linhas.length ? linhas : [{}]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, nomeFolha.slice(0, 31));
  XLSX.writeFile(wb, `${nomeFicheiro}.xlsx`);
};

/* ---------- seed de tarefas (definidas em reunião de equipa) ---------- */
// cada linha combinada título+responsável só é adicionada uma vez (não duplica em recarregamentos)
const SEED_TASKS = [
  // renovar a lista de contactos de artistas, preencher no Excel e voltar a contactar
  { titulo: "Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los", responsavel: "Jonathan" },
  { titulo: "Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los", responsavel: "Martim" },
  { titulo: "Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los", responsavel: "Sara" },
  { titulo: "Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los", responsavel: "Lara Leão" },
  // renovar a lista de contactos dos espaços e voltar a contactar
  { titulo: "Renovar a lista de contactos dos espaços e voltar a contactá-los", responsavel: "Lara Costa" },
  { titulo: "Renovar a lista de contactos dos espaços e voltar a contactá-los", responsavel: "Andreia" },
  // responder ao Vita
  { titulo: "Responder ao Vita", responsavel: "Maria Rita" },
  // perceber quais os parceiros a contactar nesta fase + definir proposta de valor
  { titulo: "Perceber quais os parceiros que é importante contactar nesta fase", responsavel: "Maria Rita" },
  { titulo: "Perceber quais os parceiros que é importante contactar nesta fase", responsavel: "Tiago" },
  { titulo: "Perceber quais os parceiros que é importante contactar nesta fase", responsavel: "Ana" },
  { titulo: "Definir uma proposta de valor para esses parceiros", responsavel: "Maria Rita" },
  { titulo: "Definir uma proposta de valor para esses parceiros", responsavel: "Tiago" },
  { titulo: "Definir uma proposta de valor para esses parceiros", responsavel: "Ana" },
  // posteriormente — comunicação marca reunião para discutir e apresentar à equipa
  { titulo: "Ter mais ideias para comunicar o concerto e ajudar na divulgação (ex.: ideia dos embaixadores) — combinar reunião com a equipa para apresentar propostas", responsavel: "Comunicação" },
].map((t) => ({ ...blankTask(), ...t }));

// junta a lista de tarefas guardada com as tarefas-seed, comparando por título + responsável
// (permite a mesma tarefa aparecer para várias pessoas sem nunca duplicar ao recarregar)
const normTitulo = (s) => (s || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const chaveTarefa = (t) => `${normTitulo(t.titulo)}|${normTitulo(t.responsavel)}`;
const mergeTasksByTituloResp = (base, extras) => {
  const existentes = new Set(base.map(chaveTarefa));
  const aAdicionar = extras.filter((t) => t.titulo && !existentes.has(chaveTarefa(t)));
  return [...base, ...aAdicionar];
};

/* ---------- seed data (dados reais já recolhidos) ---------- */
const SEED = [
  { nome: "Gisela João", email: "pm@match-attack.com", telefone: "938 769 898", pessoaContacto: "Pedro Mota", estado: "Pediu mais informações", observacoes: "A Gisela está em produção do novo disco. Deverá ser difícil, mas pediu mais informações, inclusive onde vai ser o concerto." },
  { nome: "Pedro Abrunhosa", email: "pedro@abrunhosa.com | info@sonsemtransito.com", telefone: "", pessoaContacto: "", estado: "A aguardar resposta", observacoes: "" },
  { nome: "Luísa Sobral", email: "booking@luisasobral.com", telefone: "916 253 708", pessoaContacto: "Leonor Castro", estado: "Positivo / Disponível", observacoes: "Para confirmar disponibilidade, precisa de datas, do espaço e a quem seria dirigido." },
  { nome: "Salvador Sobral", email: "team.salvadorsobral@gmail.com | bles@produccionesbles.com", telefone: "", pessoaContacto: "", estado: "Recusado", observacoes: "Está a gravar novo projeto." },
  { nome: "Zé Amaro", email: "ze.amaro@live.com.pt", telefone: "", pessoaContacto: "", estado: "A aguardar resposta", observacoes: "" },
  { nome: "Tony Carreira", email: "booking@regiconcerto.com", telefone: "", pessoaContacto: "", estado: "A aguardar resposta", observacoes: "" },
  { nome: "Mariza", email: "diogoalves@ruelamusic.com", telefone: "", pessoaContacto: "", estado: "A aguardar resposta", observacoes: "" },
  { nome: "Carolina Deslandes", email: "miguelvilarinho@sonsemtransito.com", telefone: "", pessoaContacto: "", estado: "A aguardar resposta", observacoes: "" },
  { nome: "Augusto Canário", email: "augustocanario@hotmail.com", telefone: "", pessoaContacto: "", estado: "Positivo / Disponível", observacoes: "Está disponível, tem de ser à semana." },
  { nome: "Dino d'Santiago", email: "ines.lopes@arruada.com | info@okiolo.com", telefone: "", pessoaContacto: "", estado: "A aguardar resposta", observacoes: "" },
  { nome: "Rui Veloso", email: "parceriasveloso@gmail.com | falabeloso@gmail.com", telefone: "", pessoaContacto: "", estado: "A aguardar resposta", observacoes: "" },
  { nome: "Sara Correia", email: "claudia.santos@gtstalent.com", telefone: "", pessoaContacto: "", estado: "Recusado", observacoes: "Recusaram, sem mais detalhes." },
  { nome: "Fernando Daniel", email: "catarina.vilela@umusic.com", telefone: "", pessoaContacto: "", estado: "Recusado", observacoes: "Sem disponibilidade de agenda, esperam colaborar numa próxima." },
  { nome: "Cuca Roseta", email: "booking@cucaroseta.com | management@cucaroseta.com", telefone: "964 308 911", pessoaContacto: "Miguel Capucho", estado: "Recusado", observacoes: "Já preencheu a cota de eventos solidários este ano, disponível para retomar contacto em 2027." },
].map((a) => ({ ...blankArtist(), ...a, agencia: "" }));

/* ---------- novos artistas (lista de agentes/agências recolhida) ---------- */
const NOVOS_ARTISTAS = [
  { nome: "Diogo Piçarra", email: "joana.nevesdesousa@gtstalent.com | catarina.vilela@gtstalent.com", observacoes: "Booking: catarina.vilela@gtstalent.com" },
  { nome: "Los Romeros", email: "geral@homeoutagencia.com", telefone: "+351 914 124 534" },
  { nome: "Rita Rocha", email: "info@sonsemtransito.com" },
  { nome: "Diana Vilarinho", email: "marianacouto@sonsemtransito.com" },
  { nome: "Bandidos do Cante" },
  { nome: "Vizinhos", email: "osvizinhos.booking@gmail.com" },
  { nome: "Syro", email: "andreferreira@mundoscruzados.pt" },
  { nome: "Mimi Cat", email: "info@inarteria.pt" },
  { nome: "Nuno Siqueira", email: "nunosiqueira@outlook.pt" },
  { nome: "Raquel Tavares", pessoaContacto: "José Morais / Luís Pardelha / Tânia Monteiro", email: "josemorais@produtoresassociados.com | luispardelha@produtoresassociados.com | taniamonteiro@produtoresassociados.com", telefone: "+351 914 764 548 | +351 917 277 790 | +351 918 950 046" },
  { nome: "Cláudia Pascoal", email: "claudia.santos@gtstalent.com" },
  { nome: "Rita Guerra", email: "booking@ruelamusic.com", telefone: "963 381 556" },
  { nome: "Lena D'Água", pessoaContacto: "José Morais / Luís Pardelha / Tânia Monteiro / Maria Torres", email: "josemorais@produtoresassociados.com | luispardelha@produtoresassociados.com | taniamonteiro@produtoresassociados.com | mariatorres@produtoresassociados.com", telefone: "+351 914 764 548 | +351 917 277 790 | +351 918 950 046 | +351 913 900 407" },
  { nome: "Virgul", email: "diogoalves@ruelamusic.com", telefone: "+351 963 381 556 | +351 219 249 249" },
  { nome: "Miguel Gameiro", email: "ospolonorte@gmail.com", telefone: "939166161" },
  { nome: "Marco Rodrigues", email: "michelle.sancho@gtstalent.com" },
  { nome: "Sérgio Godinho", email: "ticha@vachier.pt | paulosalgado@vachier.pt", telefone: "+351 936 802 002 | +351 214 168 300 | +351 967 018 067" },
  { nome: "André Sardet", email: "producao@domingonomundo.pt" },
  { nome: "Bianca Barros" },
  { nome: "Edmundo Inácio" },
  { nome: "Diogo Clemente" },
  { nome: "Catarina Filipe" },
  { nome: "Dulce Pontes" },
  { nome: "IRMA" },
  { nome: "João Gil" },
  { nome: "Mafalda Veiga" },
  { nome: "Matay" },
  { nome: "Maria Gil de Azevedo", observacoes: "The Voice" },
  { nome: "Milhanas" },
  { nome: "Mimi Froes" },
  { nome: "João Só e Abandonados" },
  { nome: "Lúcia Moniz" },
  { nome: "Deolinda" },
  { nome: "Descendentes" },
  { nome: "Rita Redshoes" },
  { nome: "Soraia Tavares" },
  { nome: "Toranja" },
  { nome: "Ala dos Namorados" },
  { nome: "NAPA" },
  { nome: "Luís Represas" },
  { nome: "MadreDeus" },
  { nome: "Humanos" },
  { nome: "Para Sempre Marco" },
  { nome: "Márcia" },
  { nome: "Maninho" },
  { nome: "Murta" },
  { nome: "Noninho" },
  { nome: "Mariana Pereira" },
  { nome: "The Black Mamba" },
  { nome: "Afonso Dubraz" },
  { nome: "Diana Castro" },
  { nome: "Joana Oliveira" },
  { nome: "Tiago Nacarato" },
  { nome: "Nuno Ribeiro" },
  { nome: "Carolina de Deus" },
  { nome: "Nena" },
  { nome: "Joana Almeirante" },
  { nome: "Maro" },
  { nome: "Elisa" },
  { nome: "Ana Bacalhau" },
  { nome: "Paulo Gonzo" },
  { nome: "Tim" },
  { nome: "João Pedro Pais" },
  { nome: "David Fonseca" },
  { nome: "Clã" },
  { nome: "Capitão Fausto" },
  { nome: "Delfins" },
  { nome: "Camané" },
  { nome: "Carminho" },
  { nome: "Fingertips" },
  { nome: "The Gift" },
  { nome: "Virgem Suta" },
  { nome: "Blind Zero" },
  { nome: "Paulo de Carvalho" },
  { nome: "Pedro Moutinho" },
  { nome: "Jorge Guerreiro" },
  { nome: "Matias Damásio" },
  { nome: "Agir" },
  { nome: "April Ivy" },
  { nome: "Berg" },
  { nome: "Fernando Pereira" },
  { nome: "Paulo Sousa" },
  { nome: "Pedro Gonçalves" },
  { nome: "Richie Campbell" },
  { nome: "UHF" },
  { nome: "Wanda Stuart" },
  { nome: "David Antunes + Jéssica Cipriano + Carolina Ligeiro" },
  { nome: "Zarko" },
  { nome: "Ivandro" },
  { nome: "Bia Caboz" },
  { nome: "Francisca Borges" },
  { nome: "Mickael Carreira" },
  { nome: "David Carreira" },
  { nome: "Ornatos Violeta" },
  { nome: "Linda Martini" },
  { nome: "Marisa Liz" },
  { nome: "Os Alentons" },
  { nome: "TT", email: "ttconcertos@gmail.com" },
].map((a) => ({ ...blankArtist(), ...a }));

/* ---------- seed data de espaços (dados reais já recolhidos) ---------- */
const SEED_ESPACOS = [
  {
    nome: "Teatro Jordão (Câmara de Guimarães)", cidade: "Guimarães", capacidade: "400",
    email: "geral@aoficina.pt", telefone: "253 421 200", estado: "A aguardar resposta",
    dataUltimoContacto: "2026-04-20", observacoes: "",
  },
  {
    nome: "Centro Cultural Vila Flor", cidade: "Guimarães", capacidade: "Pequeno Auditório: 200; Grande Auditório: 800",
    email: "geral@ccvf.pt", telefone: "253 424 700", estado: "A aguardar resposta",
    dataUltimoContacto: "2026-04-21", observacoes: "Site: https://www.ccvf.pt/espacos/",
  },
  {
    nome: "Forum Braga", cidade: "Braga", capacidade: "",
    email: "sandra.vaz@investbraga.com", telefone: "914 328 872", estado: "Por contactar",
    dataUltimoContacto: "", observacoes: "Em novembro disseram que teríamos 30% de desconto - vamos ver pelo município se nos arranjam algum desconto melhor.",
  },
  {
    nome: "Espaço Vita", cidade: "Braga", capacidade: "491",
    email: "info@espacovita.pt", telefone: "253 203 180", estado: "Por contactar",
    dataUltimoContacto: "", observacoes: "Tinham dado resposta negativa, agora vamos esperar pelo município se conseguem. Site: https://www.espacovita.pt/espaco/auditorio/",
  },
  {
    nome: "Casa das Artes", cidade: "Vila Nova de Famalicão", capacidade: "Grande Auditório: 500",
    email: "casadasartes@famalicao.pt", telefone: "252 371 297", estado: "Recusado",
    dataUltimoContacto: "2026-04-21", observacoes: "Disseram que já tinham tido propostas deste género, iam avaliar internamente mas disseram logo que para já não. Site: https://www.famalicao.pt/visitar-casa-dasartes",
  },
  {
    nome: "Pousada da Juventude", cidade: "Braga", capacidade: "226",
    email: "pousadadejuventude@investbraga.com", telefone: "253 148 682", estado: "Positivo / Disponível",
    dataUltimoContacto: "2026-11-24", observacoes: "Muito poucos lugares mas o senhor mostrou-se disponível para nos ajudar e aconselhar. Site: https://www.centrojuventudebraga.pt/Detail/Index/f3620fc3-7052-11ea-8600-025041000001",
  },
  {
    nome: "Município de Braga", cidade: "Braga", capacidade: "",
    email: "info@cm-braga.pt", telefone: "253 616 060", estado: "A aguardar resposta",
    dataUltimoContacto: "2026-02-26", observacoes: "Já tivemos uma reunião com eles, agora estamos à espera de ter os documentos prontos para restabelecer contacto. Site: https://braga.balcaoeletronico.pt/catalog/t/3bdc95b5-b1a2-483c-b22db7a4ac11c795",
  },
  {
    nome: "Auditório Nobre (UM - Azurém)", cidade: "Guimarães", capacidade: "482",
    email: "ccultural@reitoria.uminho.pt", telefone: "253 601 067", estado: "Positivo / Disponível",
    dataUltimoContacto: "2026-04-22", observacoes: "Já contactámos por muitos emails e chamadas e ninguém nos soube dar uma resposta; de qualquer forma vamos deixar para se for preciso algo mais pequeno, e vamos até à reitoria se for preciso.",
  },
  {
    nome: "Auditório A1 (UM - Gualtar)", cidade: "Braga", capacidade: "380",
    email: "ccultural@reitoria.uminho.pt", telefone: "", estado: "Positivo / Disponível",
    dataUltimoContacto: "2026-04-22", observacoes: "",
  },
].map((a) => ({ ...blankSpace(), ...a }));

/* ---------- storage helpers ---------- */
const KEY_ARTISTS = "ymec_artists_v1";
const KEY_SPACES = "ymec_spaces_v1";
const KEY_PARTNERS = "ymec_partners_v1";
const KEY_MEMBERS = "ymec_members_v1";
const KEY_TEMPLATES = "ymec_templates_v1";
const KEY_TASKS = "ymec_tasks_v1";
const KEY_DOCUMENTS = "ymec_documents_v1";

export default function App() {
  const [booted, setBooted] = useState(false);
  // Só se anuncia a espera quando ela é percetível; abaixo disso, a mensagem
  // apareceria e desapareceria num piscar de olhos, o que incomoda mais do que
  // ajuda.
  const [mostrarEspera, setMostrarEspera] = useState(false);
  // Quem tem sessão iniciada. Vem do Supabase Auth (ver src/lib/auth.js), não
  // de uma escolha guardada no browser: é isso que impede alguém de se fazer
  // passar por outra pessoa.
  const [user, setUser] = useState(null);
  const [sessaoVerificada, setSessaoVerificada] = useState(false);
  // Cargo e departamento de quem tem sessão, para preencher a assinatura dos
  // e-mails sem obrigar a escrevê-los à mão em cada envio.
  const [remetente, setRemetente] = useState(null);
  // Cargo e departamento de toda a equipa, indexados por nome: os e-mails são
  // assinados pelo responsável do contacto, que pode não ser quem os envia.
  const [dadosEquipa, setDadosEquipa] = useState({});
  // Modo visitante: consulta tudo, não altera nada. Guardado na sessão do
  // browser para sobreviver a recarregar a página e às remontagens da
  // sincronização, tal como acontece com o módulo escolhido.
  const [visitante, setVisitante] = useState(() => {
    try { return window.sessionStorage.getItem("ymec_visitante") === "1"; } catch { return false; }
  });
  const soLeitura = visitante;
  const [members, setMembers] = useState([]);
  const [artists, setArtists] = useState(null);
  const [spaces, setSpaces] = useState(null);
  const [partners, setPartners] = useState(null);
  const [templates, setTemplates] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [module, setModuleKey] = useState(() => {
    try { return window.sessionStorage.getItem("ymec_module") || "artistas"; } catch { return "artistas"; }
  });
  const [toast, setToast] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const ecraEstreito = useEcraEstreito();
  const tasksRef = useRef([]);

  // mantém as tarefas "automáticas" (Contactar X) sincronizadas com o campo Responsável
  // de cada contacto (artista/espaço/parceiro) — uma por contacto, por tipo
  const syncContactTasks = async (tipo, contactList) => {
    const verbo = TASK_TIPOS[tipo].verbo;
    const base = tasksRef.current || [];
    const outros = base.filter((t) => !(t.origem && t.origem.tipo === tipo));
    const existentesPorId = {};
    base.forEach((t) => { if (t.origem && t.origem.tipo === tipo) existentesPorId[t.origem.contactId] = t; });

    const auto = [];
    (contactList || []).forEach((c) => {
      if (!c.responsavel) return;
      const existente = existentesPorId[c.id];
      if (existente) {
        auto.push({ ...existente, titulo: `${verbo}: ${c.nome}`, responsavel: c.responsavel, origem: { tipo, contactId: c.id } });
      } else {
        auto.push({
          // Antes o id era derivado do contacto (`auto-tipo-id`) para evitar
          // duplicados. Isso deixou de ser preciso — há um índice único na base
          // de dados — e o formato não era um UUID válido, pelo que a tarefa
          // nunca chegava a ser gravada.
          id: uid(),
          titulo: `${verbo}: ${c.nome}`,
          responsavel: c.responsavel,
          dataLimite: c.dataProximoContacto || "",
          estado: "Por fazer",
          prioridade: "Média",
          origem: { tipo, contactId: c.id },
          criadoPor: "sistema",
          atualizadoPor: "sistema",
          criadoEm: new Date().toISOString(),
        });
      }
    });

    const next = [...auto, ...outros];
    if (JSON.stringify(next) !== JSON.stringify(base)) {
      tasksRef.current = next;
      setTasks(next);
      try {
        await window.storage.set(KEY_TASKS, JSON.stringify(next), true);
      } catch (e) {
        // Não interrompe o trabalho da pessoa (estas tarefas são geradas
        // automaticamente), mas fica registado — em silêncio, um erro aqui
        // fazia as tarefas parecerem criadas sem nunca terem sido gravadas.
        console.error("[Concerto] Falha ao sincronizar tarefas automáticas", e);
      }
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setMostrarEspera(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Recupera a sessão iniciada (sobrevive a recarregar a página e às
  // remontagens provocadas pela sincronização).
  useEffect(() => {
    (async () => {
      try {
        setUser(await membroComSessao());
      } catch {
        setUser(null);
      } finally {
        setSessaoVerificada(true);
      }
    })();
  }, []);

  // Informa a camada de dados de que nada pode ser gravado. Fica aqui, e não
  // só nos botões, para nenhum caminho esquecido do interface conseguir
  // escrever — incluindo as tarefas automáticas, criadas sem intervenção.
  useEffect(() => {
    definirApenasLeitura(soLeitura);
    try {
      if (visitante) window.sessionStorage.setItem("ymec_visitante", "1");
      else window.sessionStorage.removeItem("ymec_visitante");
    } catch {}
  }, [soLeitura, visitante]);

  // Dados de toda a equipa, para preencher as assinaturas dos e-mails.
  useEffect(() => {
    if (!booted) return;
    let cancelado = false;
    (async () => {
      try {
        const d = await dadosDeTodosOsMembros();
        if (!cancelado) setDadosEquipa(d);
      } catch {
        // Sem estes dados as assinaturas saem vazias, mas o resto funciona.
        if (!cancelado) setDadosEquipa({});
      }
    })();
    return () => { cancelado = true; };
  }, [booted]);

  // Dados para a assinatura, recarregados sempre que muda quem está a usar.
  useEffect(() => {
    if (!user) { setRemetente(null); return; }
    let cancelado = false;
    (async () => {
      try {
        const d = await dadosMembro(user);
        if (!cancelado) setRemetente(d);
      } catch {
        if (!cancelado) setRemetente({ nome: user, cargo: "", departamento: "" });
      }
    })();
    return () => { cancelado = true; };
  }, [user]);

  useEffect(() => {
    try { window.sessionStorage.setItem("ymec_module", module); } catch {}
  }, [module]);

  useEffect(() => {
    (async () => {
      // Lê tudo em paralelo. Em série, com a base de dados remota, as sete
      // leituras somavam-se e o ecrã "A preparar a plataforma…" ficava vários
      // segundos à vista.
      const ler = async (chave, seFalhar = []) => {
        try {
          const r = await window.storage.get(chave, true);
          return r && r.value ? JSON.parse(r.value) : seFalhar;
        } catch {
          return seFalhar;
        }
      };

      const [
        artistasLidos, espacosLidos, parceirosLidos,
        templatesLidos, membrosLidos, documentosLidos, tarefasLidas,
      ] = await Promise.all([
        ler(KEY_ARTISTS), ler(KEY_SPACES), ler(KEY_PARTNERS),
        ler(KEY_TEMPLATES), ler(KEY_MEMBERS), ler(KEY_DOCUMENTS), ler(KEY_TASKS),
      ]);

      // Os dados iniciais (artistas, espaços, templates e tarefas) já vivem na
      // base de dados, inseridos pelo seed SQL. Só se recorre às listas em
      // código quando a leitura vem vazia — caso contrário, cada arranque
      // reescrevia centenas de registos e podia sobrepor o trabalho de quem
      // estivesse a editar ao mesmo tempo.
      const artistas = artistasLidos.length ? artistasLidos : mergeByNome(SEED, NOVOS_ARTISTAS);
      const espacos = espacosLidos.length ? espacosLidos : mergeByNome([], SEED_ESPACOS);
      const templatesFinal = templatesLidos.length ? templatesLidos : mergeByNome([], SEED_TEMPLATES);
      const tarefas = tarefasLidas.length ? tarefasLidas : mergeTasksByTituloResp([], SEED_TASKS);

      setArtists(artistas);
      setSpaces(espacos);
      setPartners(parceirosLidos);
      setTemplates(templatesFinal);
      setMembers(membrosLidos);
      setDocuments(documentosLidos);
      setTasks(tarefas);
      tasksRef.current = tarefas;

      // Mostra já a plataforma: a sincronização das tarefas automáticas não
      // precisa de bloquear a entrada.
      setBooted(true);

      // Se a base de dados estava vazia, guarda os dados iniciais.
      if (!artistasLidos.length) await window.storage.set(KEY_ARTISTS, JSON.stringify(artistas), true);
      if (!espacosLidos.length) await window.storage.set(KEY_SPACES, JSON.stringify(espacos), true);
      if (!templatesLidos.length) await window.storage.set(KEY_TEMPLATES, JSON.stringify(templatesFinal), true);
      if (!tarefasLidas.length) await window.storage.set(KEY_TASKS, JSON.stringify(tarefas), true);

      // sincroniza as tarefas automáticas com os responsáveis já definidos nos contactos
      await syncContactTasks("artista", artistas);
      await syncContactTasks("espaco", espacos);
      await syncContactTasks("parceiro", parceirosLidos);
    })();
  }, []);

  // corre a verificação automática do follow-up assim que a plataforma arranca, e depois periodicamente
  // (a cada 5 minutos) enquanto a app estiver aberta, para apanhar contactos cujo intervalo de espera
  // termina durante a sessão sem que seja preciso recarregar a página
  useEffect(() => {
    if (!booted) return;
    runFollowupAutoScan();
    const id = setInterval(() => runFollowupAutoScan(), 5 * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted, artists, spaces, partners, templates]);

  // Termina a sessão no Supabase, não apenas no ecrã: sem isto o token
  // continuava válido e bastava recarregar para voltar a entrar.
  const terminarSessao = async () => {
    try { await sair(); } catch {}
    setUser(null);
    setVisitante(false);
  };

  const showToast = (msg, kind = "info") => {
    setToast({ msg, kind });
    clearTimeout(showToast._t);
    // Os erros ficam mais tempo no ecrã: uma gravação falhada que passe
    // despercebida faz a pessoa pensar que o trabalho ficou guardado.
    showToast._t = setTimeout(() => setToast(null), kind === "error" ? 9000 : 2600);
  };

  // Grava e devolve se correu bem. O estado no ecrã é atualizado à mesma (para
  // a edição não parecer perdida), mas o erro é mostrado com o motivo, porque
  // ficar só na consola levava a equipa a julgar que estava tudo guardado.
  const gravar = async (chave, valor) => {
    try {
      await window.storage.set(chave, JSON.stringify(valor), true);
      return true;
    } catch (e) {
      console.error("[Concerto] Falha ao guardar", chave, e);
      showToast(
        `Não foi possível guardar${e?.message ? ` (${e.message})` : ""}. ` +
          "Verifica a ligação e tenta novamente — as alterações ainda não estão seguras.",
        "error"
      );
      return false;
    }
  };

  const persistArtists = async (next) => {
    setArtists(next);
    await gravar(KEY_ARTISTS, next);
    await syncContactTasks("artista", next);
  };

  const persistSpaces = async (next) => {
    setSpaces(next);
    await gravar(KEY_SPACES, next);
    await syncContactTasks("espaco", next);
  };

  const persistPartners = async (next) => {
    setPartners(next);
    await gravar(KEY_PARTNERS, next);
    await syncContactTasks("parceiro", next);
  };

  const persistTemplates = async (next) => {
    setTemplates(next);
    await gravar(KEY_TEMPLATES, next);
  };

  const persistTasks = async (next) => {
    tasksRef.current = next;
    setTasks(next);
    await gravar(KEY_TASKS, next);
  };

  const persistDocuments = async (next) => {
    setDocuments(next);
    await gravar(KEY_DOCUMENTS, next);
  };

  // Mantém a lista de membros em memória atualizada.
  //
  // Já não cria perfis: desde que a entrada passou a ser por código, os
  // perfis vêm da base de dados e são ligados a contas de autenticação. Tentar
  // inseri-los daqui falhava com erro de nome duplicado e mostrava um aviso de
  // gravação a quem apenas tinha entrado na plataforma.
  const registerMember = (name) => {
    if (!name || members.includes(name)) return;
    setMembers((atuais) => (atuais.includes(name) ? atuais : [...atuais, name]));
  };

  // ---------- seguimento, follow-up automático, notas e conclusão de tarefas ----------
  // Estas funções vivem no App porque tocam em mais do que um módulo (contactos + tarefas) e são a
  // única fonte de verdade: todas as listas (Artistas/Espaços/Parceiros) chamam sempre a mesma função,
  // por isso nunca há informação duplicada ou dessincronizada entre as duas vistas.
  const persistByTipo = { artista: persistArtists, espaco: persistSpaces, parceiro: persistPartners };
  const listByTipo = { artista: artists, espaco: spaces, parceiro: partners };

  // template correspondente a uma fase concreta (mesma categoria do tipo de contacto)
  const templateDaFase = (tipo, fase) => {
    const categoria = TIPOS_CONTACTO[tipo]?.categoriaTemplate;
    return (templates || []).find((t) => t.categoria === categoria && Number(t.fase) === fase) || null;
  };

  // procura o próximo template de follow-up (mesma categoria do tipo de contacto, fase seguinte)
  const nextFaseTemplate = (tipo, faseAtual) => templateDaFase(tipo, faseAtual + 1);

  // número de dias a aguardar, sem resposta, antes de se avançar para o follow-up da fase seguinte —
  // vem do template da fase ATUAL (cada fase pode ter o seu próprio intervalo); usa o valor por
  // omissão quando a fase não tem template associado ou não define um intervalo próprio
  const intervaloDaFase = (tipo, faseAtual) => {
    const tmpl = templateDaFase(tipo, faseAtual || 1);
    const n = Number(tmpl?.intervaloDias);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_FOLLOWUP_DIAS;
  };

  const diasDesdeUltimoEnvio = (contact) => {
    const dataEnvio = contact.dataUltimoEnvio ? new Date(contact.dataUltimoEnvio) : null;
    return dataEnvio ? Math.floor((Date.now() - dataEnvio.getTime()) / 86400000) : null;
  };

  // cria a tarefa de follow-up da fase seguinte + regista o evento correspondente na timeline do
  // contacto. Usada tanto pelo clique manual em "Ainda sem resposta" como pela verificação automática
  // por tempo (autoOrigem controla o texto/tipo do evento gerado, para se distinguir na timeline).
  const criarFollowupTask = async (tipo, contact, { auto = false, dias = null } = {}) => {
    const faseAtual = contact.faseFollowup || 1;
    const faseSeguinte = faseAtual + 1;
    const tmpl = nextFaseTemplate(tipo, faseAtual);
    const verbo = TASK_TIPOS[tipo].verbo;
    const novaTarefa = {
      id: uid(),
      titulo: `Follow-up (Fase ${faseSeguinte}) — ${verbo}: ${contact.nome}`,
      responsavel: contact.responsavel,
      dataLimite: new Date().toISOString().slice(0, 10),
      estado: "Por fazer",
      prioridade: "Média",
      origem: { tipo, contactId: contact.id, evento: "followup", fase: faseSeguinte, templateId: tmpl?.id || null },
      criadoPor: "sistema",
      atualizadoPor: "sistema",
      criadoEm: new Date().toISOString(),
    };
    const evento = auto
      ? { id: uid(), tipo: "followup_auto", data: new Date().toISOString(), user: "sistema", fase: faseSeguinte, templateNome: tmpl?.nome || null, dias }
      : { id: uid(), tipo: "followup_criado", data: new Date().toISOString(), user, fase: faseSeguinte, templateNome: tmpl?.nome || null };
    const updated = { ...contact, faseFollowup: faseSeguinte, aguardaResposta: true, historico: [evento, ...(contact.historico || [])] };
    return { novaTarefa, updated, tmpl, faseSeguinte };
  };

  // chamada quando o utilizador indica, na secção "Seguimento" de um contacto ou numa tarefa de
  // follow-up, se houve ou não resposta
  const handleResposta = async (tipo, contactId, teveResposta) => {
    const persist = persistByTipo[tipo];
    const list = listByTipo[tipo] || [];
    const contact = list.find((c) => c.id === contactId);
    if (!contact || !persist) return null;

    if (teveResposta) {
      const evento = { id: uid(), tipo: "resposta", data: new Date().toISOString(), user };
      const updated = { ...contact, aguardaResposta: false, historico: [evento, ...(contact.historico || [])] };
      await persist(list.map((c) => (c.id === contactId ? updated : c)));
      showToast(`Resposta de ${contact.nome} registada — segue para a fase seguinte da negociação.`);
      return updated;
    }

    // "não houve resposta" — só se cria manualmente a tarefa de follow-up ao fim do intervalo da fase
    // atual (o mesmo acontece automaticamente, sem precisar deste clique, através do scan periódico)
    const dias = diasDesdeUltimoEnvio(contact);
    const intervalo = intervaloDaFase(tipo, contact.faseFollowup);
    if (dias === null) {
      showToast("Este contacto ainda não tem nenhum e-mail enviado a partir da plataforma.", "error");
      return null;
    }
    if (dias < intervalo) {
      showToast(`Ainda não passaram ${intervalo} dias desde o envio (${dias} dia(s)). O follow-up automático só é criado ao fim de ${intervalo} dias sem resposta.`, "error");
      return null;
    }

    const { novaTarefa, updated, tmpl, faseSeguinte } = await criarFollowupTask(tipo, contact, { auto: false });
    await persistTasks([novaTarefa, ...(tasksRef.current || [])]);
    await persist(list.map((c) => (c.id === contactId ? updated : c)));
    showToast(`Follow-up (Fase ${faseSeguinte}) criado para ${contact.nome}${tmpl ? ` — template "${tmpl.nome}"` : ""}.`);
    return updated;
  };

  // regista o primeiro contacto de um contacto diretamente a partir da conclusão da tarefa "Contactar X"
  // (quando o utilizador ainda não enviou nenhum e-mail pela secção "Comunicação"). Tem exatamente o
  // mesmo efeito que enviar o primeiro e-mail: inicia o fluxo de acompanhamento/follow-up automático.
  const marcarPrimeiroContacto = async (tipo, contactId) => {
    const persist = persistByTipo[tipo];
    const list = listByTipo[tipo] || [];
    const contact = list.find((c) => c.id === contactId);
    if (!contact || !persist || contact.aguardaResposta) return null;
    const agora = new Date().toISOString();
    const evento = { id: uid(), tipo: "primeiro_contacto", data: agora, user };
    const updated = {
      ...contact,
      historico: [evento, ...(contact.historico || [])],
      estado: "A aguardar resposta",
      aguardaResposta: true,
      dataUltimoEnvio: agora,
      dataUltimoContacto: agora.slice(0, 10),
      faseFollowup: contact.faseFollowup || 1,
    };
    await persist(list.map((c) => (c.id === contactId ? updated : c)));
    showToast(`${contact.nome} marcado como contactado — seguimento automático iniciado.`);
    return updated;
  };

  // ---------- verificação automática, por tempo, do fluxo de follow-up ----------
  // corre no arranque da plataforma e periodicamente enquanto a app está aberta: para cada contacto
  // "A aguardar resposta", vê há quantos dias foi feito o último envio e, assim que esse número atinge
  // o intervalo definido para a fase atual (template.intervaloDias, com o valor por omissão de
  // DEFAULT_FOLLOWUP_DIAS), cria automaticamente a tarefa de follow-up da fase seguinte — sem precisar
  // de qualquer ação do utilizador. Evita duplicados verificando se já existe uma tarefa de follow-up
  // pendente para essa fase.
  const runFollowupAutoScan = async () => {
    for (const tipo of ["artista", "espaco", "parceiro"]) {
      const persist = persistByTipo[tipo];
      const list = listByTipo[tipo] || [];
      if (!list.length) continue;
      let listaAtualizada = null;
      const novasTarefas = [];
      for (const contact of list) {
        if (!contact.aguardaResposta || !contact.dataUltimoEnvio) continue;
        const dias = diasDesdeUltimoEnvio(contact);
        const intervalo = intervaloDaFase(tipo, contact.faseFollowup);
        if (dias === null || dias < intervalo) continue;
        const faseSeguinte = (contact.faseFollowup || 1) + 1;
        const jaTemPendente = (tasksRef.current || []).some(
          (t) => t.origem && t.origem.tipo === tipo && t.origem.contactId === contact.id &&
            t.origem.evento === "followup" && t.origem.fase === faseSeguinte
        );
        if (jaTemPendente) continue;
        const { novaTarefa, updated } = await criarFollowupTask(tipo, contact, { auto: true, dias });
        novasTarefas.push(novaTarefa);
        listaAtualizada = (listaAtualizada || list).map((c) => (c.id === contact.id ? updated : c));
      }
      if (novasTarefas.length) {
        await persistTasks([...novasTarefas, ...(tasksRef.current || [])]);
      }
      if (listaAtualizada) {
        await persist(listaAtualizada);
      }
    }
  };

  // adiciona uma nota à timeline de um contacto (artista, espaço ou parceiro)
  const addNotaContacto = async (tipo, contactId, texto) => {
    if (!texto || !texto.trim()) return null;
    const persist = persistByTipo[tipo];
    const list = listByTipo[tipo] || [];
    const contact = list.find((c) => c.id === contactId);
    if (!contact || !persist) return null;
    const evento = { id: uid(), tipo: "nota", data: new Date().toISOString(), user, texto: texto.trim() };
    const updated = { ...contact, historico: [evento, ...(contact.historico || [])] };
    await persist(list.map((c) => (c.id === contactId ? updated : c)));
    return updated;
  };

  // edita as observações de um acontecimento já registado na timeline de um contacto (nota ou
  // email — os dois tipos de acontecimento que têm observações próprias, ver temObservacoesEvento).
  // Regista sempre quem fez a alteração e a data/hora da edição, mantendo um histórico das
  // edições anteriores (autor, data e conteúdo anterior) para auditoria.
  const editarEventoContacto = async (tipo, contactId, eventoId, updates) => {
    const persist = persistByTipo[tipo];
    const list = listByTipo[tipo] || [];
    const contact = list.find((c) => c.id === contactId);
    if (!contact || !persist) return null;
    const agora = new Date().toISOString();
    let eventoEditado = null;
    const historico = (contact.historico || []).map((h) => {
      if (h.id !== eventoId) return h;
      const antes = {};
      Object.keys(updates).forEach((k) => { antes[k] = h[k]; });
      eventoEditado = {
        ...h,
        ...updates,
        editadoPor: user,
        editadoEm: agora,
        edicoes: [...(h.edicoes || []), { user: h.editadoPor || h.user, data: h.editadoEm || h.data, ...antes }],
      };
      return eventoEditado;
    });
    if (!eventoEditado) return null;
    const updated = { ...contact, historico };
    await persist(list.map((c) => (c.id === contactId ? updated : c)));
    return updated;
  };

  const respostaHandlers = {
    artista: (id, r) => handleResposta("artista", id, r),
    espaco: (id, r) => handleResposta("espaco", id, r),
    parceiro: (id, r) => handleResposta("parceiro", id, r),
  };
  const notaHandlers = {
    artista: (id, t) => addNotaContacto("artista", id, t),
    espaco: (id, t) => addNotaContacto("espaco", id, t),
    parceiro: (id, t) => addNotaContacto("parceiro", id, t),
  };
  const editarEventoHandlers = {
    artista: (contactId, eventoId, updates) => editarEventoContacto("artista", contactId, eventoId, updates),
    espaco: (contactId, eventoId, updates) => editarEventoContacto("espaco", contactId, eventoId, updates),
    parceiro: (contactId, eventoId, updates) => editarEventoContacto("parceiro", contactId, eventoId, updates),
  };

  // assim que o estado de um contacto deixa de ser "Por contactar" (alterado na secção "Dados" do
  // contacto), a tarefa de primeiro contacto ("Contactar X") correspondente passa automaticamente a
  // "Concluída" — mantém a lista de tarefas sempre sincronizada com o estado real de cada contacto,
  // sem tocar em mais nada no contacto (o estado já foi definido manualmente por quem o editou).
  const concluirTarefaDeContacto = async (tipo, contactId) => {
    const task = (tasksRef.current || []).find(
      (t) => t.origem && t.origem.tipo === tipo && t.origem.contactId === contactId && !t.origem.evento
    );
    if (!task || task.estado === "Concluída") return;
    const next = (tasksRef.current || []).map((t) => (t.id === task.id ? {
      ...t, estado: "Concluída", atualizadoPor: user, concluidaEm: new Date().toISOString(),
    } : t));
    await persistTasks(next);
  };
  const concluirTarefaHandlers = {
    artista: (id) => concluirTarefaDeContacto("artista", id),
    espaco: (id) => concluirTarefaDeContacto("espaco", id),
    parceiro: (id) => concluirTarefaDeContacto("parceiro", id),
  };

  // move uma tarefa para um novo estado (usado pelo drag-and-drop do quadro Kanban); se a tarefa tiver
  // origem num contacto e passar a "Concluída", regista o evento na timeline desse contacto. Quando é a
  // tarefa de primeiro contacto ("Contactar X") e o contacto ainda não tinha nenhum e-mail registado,
  // concluir a tarefa tem exatamente o mesmo efeito que enviar o primeiro e-mail: inicia o fluxo de
  // acompanhamento/follow-up automático.
  const setTaskEstado = async (task, novoEstado) => {
    if (task.estado === novoEstado) return;
    const next = (tasksRef.current || []).map((t) => (t.id === task.id ? {
      ...t, estado: novoEstado, atualizadoPor: user,
      concluidaEm: novoEstado === "Concluída" ? new Date().toISOString() : "",
    } : t));
    await persistTasks(next);
    if (task.origem && novoEstado === "Concluída") {
      const { tipo, contactId, evento: eventoOrigem } = task.origem;
      const persist = persistByTipo[tipo];
      const list = listByTipo[tipo] || [];
      const contact = list.find((c) => c.id === contactId);
      if (persist && contact) {
        if (!eventoOrigem && !contact.aguardaResposta) {
          // tarefa de primeiro contacto concluída, sem envio de email prévio: inicia o seguimento
          await marcarPrimeiroContacto(tipo, contactId);
        } else {
          const evento = { id: uid(), tipo: "tarefa_concluida", data: new Date().toISOString(), user, tarefaTitulo: task.titulo };
          const updated = { ...contact, historico: [evento, ...(contact.historico || [])] };
          await persist(list.map((c) => (c.id === contactId ? updated : c)));
        }
      }
    }
  };

  // alterna entre "Concluída" e "Por fazer"
  const toggleTaskConcluida = async (task) => {
    const novoEstado = task.estado === "Concluída" ? "Por fazer" : "Concluída";
    await setTaskEstado(task, novoEstado);
  };

  if (!booted) {
    // O ecrã de espera só aparece se o carregamento demorar mais de meio
    // segundo (ver `mostrarEspera`). Num carregamento rápido mostra-se apenas o
    // fundo do ecrã de entrada, evitando um lampejo de texto entre dois ecrãs.
    return (
      <div style={{ position: "relative", background: C.gradient, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
        <style>{FONTS}</style>
        {mostrarEspera && "A preparar a plataforma…"}
      </div>
    );
  }

  // Enquanto não se sabe se há sessão, mostra o mesmo fundo do ecrã de entrada
  // — sem isto, quem já tinha sessão via o ecrã de entrada a piscar antes de
  // ser reconhecido.
  if (!sessaoVerificada) {
    return (
      <div style={{ background: C.gradient, minHeight: "100vh" }}>
        <style>{FONTS}</style>
      </div>
    );
  }

  if (!user && !visitante) {
    return (
      <div style={{ position: "relative", background: C.gradient, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: 24, overflow: "hidden" }}>
        <style>{FONTS}</style>
        {/* elementos decorativos — círculos de luz suaves, para um fundo mais dinâmico */}
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,23,140,0.35) 0%, rgba(230,23,140,0) 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-16%", left: "-10%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,27,99,0.45) 0%, rgba(74,27,99,0) 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "18%", left: "8%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 32, textAlign: "center" }}>
            <img src={LOGO_YME_LIGHT} alt="YME" style={{ height: 40, width: "auto" }} />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, letterSpacing: 0.4, fontFamily: "Inter, sans-serif",
            }}>
              Gestão de Relações Externas · IPO
            </div>
            <div>
              <div style={{ color: "#fff", fontFamily: SERIF, fontWeight: 600, fontSize: 34, lineHeight: 1.15, marginBottom: 2 }}>
                Bem-vindos ao
              </div>
              <div style={{
                fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 40, lineHeight: 1.15,
                background: "linear-gradient(90deg, #F7B9DE 0%, #FFFFFF 55%, #E6178C 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Concerto Solidário
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13.5, maxWidth: 340, lineHeight: 1.5 }}>
              Uma plataforma, uma equipa, uma só causa a favor do IPO.
            </div>
          </div>

          <div style={{ background: "rgba(15,23,43,0.55)", backdropFilter: "blur(10px)", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 24px 60px rgba(10,10,30,0.35)" }}>
            <EcraEntrada
              onEntrou={(nome, opts) => {
                if (opts?.visitante) {
                  setVisitante(true);
                  return;
                }
                setUser(nome);
                registerMember(nome);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif", background: C.bg }}>
      <style>{FONTS}</style>

      {/* Em ecrãs estreitos o menu abre por cima do conteúdo, com uma barra no
          topo para o chamar. Em ecrãs largos mantém-se sempre visível. */}
      {ecraEstreito && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 52, zIndex: 90,
          background: C.sidebar, display: "flex", alignItems: "center", gap: 12, padding: "0 14px",
        }}>
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 3.5 }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: 18, height: 2, background: "#fff", borderRadius: 2 }} />
            ))}
          </button>
          <img src={LOGO_YME_LIGHT} alt="YME" style={{ height: 16, width: "auto" }} />
          <div style={{ marginLeft: "auto", fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
            {MODULES.find((m) => m.key === module)?.label}
          </div>
        </div>
      )}

      {(!ecraEstreito || menuAberto) && (
        <Sidebar
          module={module}
          setModuleKey={(k) => { setModuleKey(k); setMenuAberto(false); }}
          user={user}
          onSair={terminarSessao}
          showToast={showToast}
          soLeitura={soLeitura}
          flutuante={ecraEstreito}
          onFechar={() => setMenuAberto(false)}
        />
      )}

      <div style={{
        flex: 1, minWidth: 0,
        padding: module === "dashboard" ? 0 : (ecraEstreito ? "16px 14px" : "28px 32px"),
        marginTop: ecraEstreito ? 52 : 0,
      }}>
        {/* O Dashboard desenha o seu próprio fundo escuro de bordo a bordo, por
            isso a faixa entraria a meio do gradiente. */}
        {module !== "dashboard" && <FaixaInstalar />}
        {module === "dashboard" ? (
          <DashboardModule
            artists={artists}
            spaces={spaces}
            partners={partners}
            tasks={tasks}
            members={members}
            user={user}
            soLeitura={soLeitura}
          />
        ) : module === "artistas" ? (
          <ArtistasModule
            artists={artists}
            persistArtists={persistArtists}
            user={user}
            soLeitura={soLeitura}
            members={members}
            registerMember={registerMember}
            showToast={showToast}
            templates={templates}
            onResposta={respostaHandlers.artista}
            onAddNota={notaHandlers.artista}
            onEditEvento={editarEventoHandlers.artista}
            onConcluirTarefaContacto={concluirTarefaHandlers.artista}
          />
        ) : module === "espacos" ? (
          <EspacosModule
            spaces={spaces}
            persistSpaces={persistSpaces}
            user={user}
            soLeitura={soLeitura}
            members={members}
            registerMember={registerMember}
            showToast={showToast}
            templates={templates}
            onResposta={respostaHandlers.espaco}
            onAddNota={notaHandlers.espaco}
            onEditEvento={editarEventoHandlers.espaco}
            onConcluirTarefaContacto={concluirTarefaHandlers.espaco}
          />
        ) : module === "parceiros" ? (
          <ParceirosModule
            partners={partners}
            persistPartners={persistPartners}
            user={user}
            soLeitura={soLeitura}
            members={members}
            registerMember={registerMember}
            showToast={showToast}
            templates={templates}
            onResposta={respostaHandlers.parceiro}
            onAddNota={notaHandlers.parceiro}
            onEditEvento={editarEventoHandlers.parceiro}
            onConcluirTarefaContacto={concluirTarefaHandlers.parceiro}
          />
        ) : module === "templates" ? (
          <TemplatesModule
            templates={templates}
            persistTemplates={persistTemplates}
            user={user}
            soLeitura={soLeitura}
            showToast={showToast}
          />
        ) : module === "tarefas" ? (
          <TarefasModule
            tasks={tasks}
            persistTasks={persistTasks}
            user={user}
            soLeitura={soLeitura}
            showToast={showToast}
            onToggleTask={toggleTaskConcluida}
            onSetTaskEstado={setTaskEstado}
            templates={templates}
            listByTipo={listByTipo}
            onResposta={respostaHandlers}
            members={members}
            remetente={remetente}
            dadosEquipa={dadosEquipa}
          />
        ) : module === "documentos" ? (
          <DocumentosModule
            documents={documents}
            persistDocuments={persistDocuments}
            user={user}
            soLeitura={soLeitura}
            showToast={showToast}
          />
        ) : (
          <ComingSoon module={MODULES.find((m) => m.key === module)} />
        )}
      </div>
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: toast.kind === "error" ? C.red : C.ink,
          color: "#fff", padding: "12px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 500,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)", zIndex: 300, maxWidth: 320,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// Faixa de convite para instalar, no topo da plataforma.
//
// A opção existe no menu do browser, mas está escondida atrás dos três pontos
// e passa despercebida — daí o convite explícito. Só aparece quando a
// instalação é mesmo possível, e quem a dispensar não volta a vê-la.
function FaixaInstalar() {
  const [convite, setConvite] = useState(null);
  const [dispensada, setDispensada] = useState(() => {
    try { return window.localStorage.getItem("ymec_instalar_dispensado") === "1"; } catch { return false; }
  });
  const [ajudaIOS, setAjudaIOS] = useState(false);

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const ehIOS = /iphone|ipad|ipod/i.test(ua);
  const ehAndroid = /android/i.test(ua);
  const ehTelemovel = ehIOS || ehAndroid;
  const jaEmApp = typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone);

  useEffect(() => {
    const aoConvite = (e) => { e.preventDefault(); setConvite(e); };
    const aoInstalar = () => {
      setConvite(null);
      try { window.localStorage.setItem("ymec_instalar_dispensado", "1"); } catch {}
      setDispensada(true);
    };
    window.addEventListener("beforeinstallprompt", aoConvite);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoConvite);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  const dispensar = () => {
    try { window.localStorage.setItem("ymec_instalar_dispensado", "1"); } catch {}
    setDispensada(true);
  };

  if (jaEmApp || dispensada) return null;
  // No telemóvel mostra-se sempre: o Chrome só emite o convite automático
  // depois de algumas visitas, e até lá ninguém descobriria que dá para
  // instalar. Sem convite, explicam-se os passos do menu do browser.
  if (!convite && !ehTelemovel) return null;

  const instalar = async () => {
    if (!convite) { setAjudaIOS(true); return; }
    convite.prompt();
    const { outcome } = await convite.userChoice;
    setConvite(null);
    if (outcome === "accepted") dispensar();
  };

  return (
    <>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        padding: "11px 16px", borderRadius: 12, marginBottom: 18,
        background: C.accentSoft, border: `1px solid ${C.accent}33`,
      }}>
        <Download size={16} color={C.accent} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 180, fontSize: 13, color: C.ink, fontWeight: 500, lineHeight: 1.4 }}>
          Instala a plataforma no teu {ehIOS ? "iPhone" : ehAndroid ? "telemóvel" : "computador"} para a abrires como uma aplicação.
        </div>
        <button type="button" onClick={instalar} style={{ ...btnPrimary, padding: "8px 14px", fontSize: 13 }}>
          <Download size={14} /> {convite ? "Instalar" : "Como instalar"}
        </button>
        <button
          type="button"
          onClick={dispensar}
          title="Não mostrar de novo"
          style={{ background: "transparent", border: "none", color: C.inkSoft, cursor: "pointer", padding: 6, display: "flex", flexShrink: 0 }}
        >
          <X size={16} />
        </button>
      </div>

      {ajudaIOS && (
        <Overlay onClose={() => setAjudaIOS(false)} narrow>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16.5, color: C.ink, marginBottom: 12 }}>
              {ehIOS ? "Instalar no iPhone" : "Instalar a aplicação"}
            </div>
            <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.6 }}>
              {ehIOS ? (
                <>
                  No Safari, toca no botão <strong>Partilhar</strong> (o quadrado
                  com a seta, em baixo) e escolhe{" "}
                  <strong>Adicionar ao ecrã principal</strong>.
                </>
              ) : (
                <>
                  Toca nos <strong>três pontos (⋮)</strong> no canto superior
                  direito do browser e escolhe{" "}
                  <strong>Instalar aplicação</strong> ou{" "}
                  <strong>Adicionar ao ecrã principal</strong>.
                </>
              )}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}`, fontSize: 12.5 }}>
                A plataforma passa a abrir como uma aplicação, com ícone próprio
                e sem a barra do browser.
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setAjudaIOS(false)} style={btnPrimary}>Entendido</button>
          </div>
        </Overlay>
      )}
    </>
  );
}

// Botão para instalar a plataforma como aplicação.
//
// O Chrome guarda o convite de instalação num evento que só dispara uma vez;
// apanhamo-lo e mostramos um botão próprio, porque a opção escondida no menu
// do browser passa despercebida à maioria das pessoas.
//
// No iPhone não existe esse evento — o Safari só instala pelo menu Partilhar —
// por isso mostram-se as instruções em vez do botão.
function BotaoInstalar({ estilo }) {
  const [convite, setConvite] = useState(null);
  const [instalado, setInstalado] = useState(false);
  const [mostrarAjudaIOS, setMostrarAjudaIOS] = useState(false);

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const ehIOS = /iphone|ipad|ipod/i.test(ua);
  const ehTelemovel = ehIOS || /android/i.test(ua);
  const jaEmApp = typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone);

  useEffect(() => {
    const aoConvite = (e) => {
      e.preventDefault();
      setConvite(e);
    };
    const aoInstalar = () => { setInstalado(true); setConvite(null); };
    window.addEventListener("beforeinstallprompt", aoConvite);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoConvite);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  // Já está instalada, ou o browser não suporta instalação.
  if (jaEmApp || instalado) return null;
  // No telemóvel mostra-se sempre (com instruções, se não houver convite do
  // browser); no computador só quando o browser o oferece.
  if (!convite && !ehTelemovel) return null;

  const instalar = async () => {
    if (!convite) { setMostrarAjudaIOS(true); return; }
    convite.prompt();
    await convite.userChoice;
    setConvite(null);
  };

  return (
    <>
      <button type="button" onClick={instalar} style={estilo} title="Instalar como aplicação">
        <Download size={14} /> {convite ? "Instalar aplicação" : "Como instalar"}
      </button>

      {mostrarAjudaIOS && (
        <Overlay onClose={() => setMostrarAjudaIOS(false)} narrow>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16.5, color: C.ink, marginBottom: 12 }}>
              {ehIOS ? "Instalar no iPhone" : "Instalar a aplicação"}
            </div>
            <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.6 }}>
              {ehIOS ? (
                <>
                  No Safari, toca no botão <strong>Partilhar</strong> (o quadrado
                  com a seta, em baixo) e escolhe{" "}
                  <strong>Adicionar ao ecrã principal</strong>.
                </>
              ) : (
                <>
                  Toca nos <strong>três pontos (⋮)</strong> no canto superior
                  direito do browser e escolhe{" "}
                  <strong>Instalar aplicação</strong> ou{" "}
                  <strong>Adicionar ao ecrã principal</strong>.
                </>
              )}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}`, fontSize: 12.5 }}>
                A plataforma passa a abrir como uma aplicação, com ícone próprio
                e sem a barra do browser.
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setMostrarAjudaIOS(false)} style={btnPrimary}>Entendido</button>
          </div>
        </Overlay>
      )}
    </>
  );
}

/* ---------- entrada com nome + código ---------- */
// Cada pessoa escolhe o seu nome e define um código na primeira entrada. Por
// trás é uma conta no Supabase Auth (ver src/lib/auth.js), mas a equipa nunca
// vê e-mails: para elas é só escolher o nome e escrever o código.
function EcraEntrada({ onEntrou }) {
  const [membros, setMembros] = useState(null);
  const [nome, setNome] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setMembros(await listarMembros());
      } catch (e) {
        setErro("Não foi possível carregar a equipa. Verifica a ligação.");
        setMembros([]);
      }
    })();
  }, []);

  const selecionado = membros?.find((m) => m.nome === nome) || null;
  const primeiraVez = selecionado && !selecionado.codigo_definido_em;

  const submeter = async (e) => {
    e.preventDefault();
    setErro("");

    if (primeiraVez) {
      if (codigo.length < COMPRIMENTO_MINIMO) {
        setErro(`O código tem de ter pelo menos ${COMPRIMENTO_MINIMO} caracteres.`);
        return;
      }
      if (codigo !== confirmacao) {
        setErro("Os códigos não coincidem.");
        return;
      }
    }

    setOcupado(true);
    try {
      if (primeiraVez) {
        await definirCodigo(nome, codigo);
        await entrar(nome, codigo);
      } else {
        await entrar(nome, codigo);
      }
      onEntrou(nome);
    } catch (err) {
      setErro(err.message || "Não foi possível entrar.");
    } finally {
      setOcupado(false);
    }
  };

  const estiloCampo = {
    width: "100%", boxSizing: "border-box", padding: "10px 13px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)",
    color: "#fff", fontSize: 13.5, fontFamily: "Inter, sans-serif", outline: "none",
  };

  if (membros === null) {
    return <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13.5 }}>A carregar a equipa…</div>;
  }

  // Passo 1 — escolher o nome
  if (!nome) {
    return (
      <>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13.5, marginBottom: 22, lineHeight: 1.5 }}>
          Escolhe o teu nome na equipa. Na primeira entrada defines um código só teu; das próximas vezes usas esse código para entrar.
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11.5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 12 }}>MEMBROS DA EQUIPA</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {membros.map((m) => (
            <button
              key={m.nome}
              type="button"
              onClick={() => { setNome(m.nome); setCodigo(""); setConfirmacao(""); setErro(""); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 13px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.9)", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500, transition: "background .15s ease, border-color .15s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(230,23,140,0.18)"; e.currentTarget.style.borderColor = "rgba(230,23,140,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; }}
            >
              <UserCircle2 size={14} /> {m.nome}
              {!m.codigo_definido_em && (
                <span style={{ fontSize: 9.5, padding: "1px 6px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>novo</span>
              )}
            </button>
          ))}
        </div>
        {erro && <div style={{ marginTop: 14, color: "#FFB4C0", fontSize: 12.5 }}>{erro}</div>}

        {/* Acesso de consulta para quem acompanha o projeto sem participar na
            organização. Não pede código e não permite alterar nada. */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <button
            type="button"
            onClick={() => onEntrou(null, { visitante: true })}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.16)", background: "transparent",
              color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontWeight: 500,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <Eye size={14} /> Entrar como visitante
          </button>
          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.4)", fontSize: 11.5, lineHeight: 1.5, textAlign: "center" }}>
            Acompanha o projeto sem poder alterar nada.
          </div>

          <BotaoInstalar estilo={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            width: "100%", marginTop: 14, padding: "9px 14px", borderRadius: 10,
            border: "1px dashed rgba(255,255,255,0.18)", background: "transparent",
            color: "rgba(255,255,255,0.55)", fontSize: 12.5, cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontWeight: 500,
          }} />
        </div>
      </>
    );
  }

  // Passo 2 — definir ou escrever o código
  return (
    <form onSubmit={submeter}>
      <button
        type="button"
        onClick={() => { setNome(null); setCodigo(""); setConfirmacao(""); setErro(""); }}
        style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 12.5, cursor: "pointer", padding: 0, marginBottom: 16, fontFamily: "Inter, sans-serif" }}
      >
        ← escolher outro nome
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: "rgba(230,23,140,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
          {nome.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{nome}</div>
      </div>

      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
        {primeiraVez
          ? `Define o teu código de acesso. Guarda-o — é com ele que entras a partir de agora, e mais ninguém o conhece.`
          : "Escreve o teu código de acesso."}
      </div>

      <input
        type="password"
        autoFocus
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder={primeiraVez ? `Novo código (mín. ${COMPRIMENTO_MINIMO} caracteres)` : "Código"}
        style={estiloCampo}
      />

      {primeiraVez && (
        <input
          type="password"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          placeholder="Repete o código"
          style={{ ...estiloCampo, marginTop: 10 }}
        />
      )}

      {erro && <div style={{ marginTop: 12, color: "#FFB4C0", fontSize: 12.5 }}>{erro}</div>}

      <button
        type="submit"
        disabled={ocupado || !codigo}
        style={{
          width: "100%", marginTop: 16, padding: "11px 16px", borderRadius: 10, border: "none",
          background: C.accent, color: "#fff", fontWeight: 600, fontSize: 14,
          cursor: ocupado || !codigo ? "not-allowed" : "pointer",
          opacity: ocupado || !codigo ? 0.5 : 1, fontFamily: "Inter, sans-serif",
        }}
      >
        {ocupado ? "A entrar…" : primeiraVez ? "Definir código e entrar" : "Entrar"}
      </button>

      {!primeiraVez && (
        <div style={{ marginTop: 14, color: "rgba(255,255,255,0.4)", fontSize: 11.5, lineHeight: 1.5 }}>
          Esqueceste-te do código? Pede a quem gere a plataforma para o repor.
        </div>
      )}
    </form>
  );
}

// Mudar o próprio código de acesso.
//
// Pede o código atual antes de mudar: sem isso, bastava apanhar uma sessão
// aberta num computador para trocar o código e ficar com o perfil.
function ModalMudarCodigo({ nome, onFechar }) {
  const [atual, setAtual] = useState("");
  const [novo, setNovo] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [feito, setFeito] = useState(false);

  const submeter = async (e) => {
    e.preventDefault();
    setErro("");
    if (novo !== confirmacao) {
      setErro("Os códigos novos não coincidem.");
      return;
    }
    setOcupado(true);
    try {
      await mudarCodigo(nome, atual, novo);
      setFeito(true);
    } catch (err) {
      setErro(err.message || "Não foi possível mudar o código.");
    } finally {
      setOcupado(false);
    }
  };

  return (
    <Overlay onClose={onFechar} narrow>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
          Mudar o meu código
        </div>
        <button onClick={onFechar} style={iconBtn}><X size={17} /></button>
      </div>

      {feito ? (
        <>
          <div style={{ padding: "22px 24px", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <CheckCircle2 size={20} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 }}>
              Código alterado. Passas a entrar com o código novo — guarda-o bem,
              porque ninguém o consegue consultar.
            </div>
          </div>
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={onFechar} style={btnPrimary}>Fechar</button>
          </div>
        </>
      ) : (
        <form onSubmit={submeter}>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Código atual">
              <input type="password" autoFocus required style={inputStyle} value={atual} onChange={(e) => setAtual(e.target.value)} />
            </Field>
            <Field label={`Código novo (mín. ${COMPRIMENTO_MINIMO} caracteres)`}>
              <input type="password" required style={inputStyle} value={novo} onChange={(e) => setNovo(e.target.value)} />
            </Field>
            <Field label="Repete o código novo">
              <input type="password" required style={inputStyle} value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
            </Field>
            {erro && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 12px", borderRadius: 9, background: C.redBg, color: C.red, fontSize: 12.5, fontWeight: 500 }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {erro}
              </div>
            )}
          </div>
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" onClick={onFechar} style={btnGhost} disabled={ocupado}>Cancelar</button>
            <button type="submit" style={{ ...btnPrimary, opacity: ocupado ? 0.6 : 1 }} disabled={ocupado}>
              {ocupado ? "A mudar…" : "Mudar código"}
            </button>
          </div>
        </form>
      )}
    </Overlay>
  );
}

/* ---------- sidebar ---------- */
// `flutuante` = ecrã estreito: o menu abre por cima do conteúdo em vez de
// ocupar uma coluna permanente, que num telemóvel comeria metade da largura.
function Sidebar({ module, setModuleKey, user, onSair, showToast, flutuante, onFechar, soLeitura }) {
  const [mudarCodigoAberto, setMudarCodigoAberto] = useState(false);
  return (
    <>
      {flutuante && (
        <div
          onClick={onFechar}
          style={{ position: "fixed", inset: 0, background: "rgba(15,20,30,0.5)", zIndex: 95 }}
        />
      )}
    <div style={{
      width: 232, background: C.sidebar, color: "#fff", display: "flex", flexDirection: "column",
      padding: "24px 16px", flexShrink: 0, borderRadius: "0",
      position: flutuante ? "fixed" : "sticky",
      // `dvh` acompanha a área realmente visível: com `vh`, as barras do
      // browser empurravam o rodapé (nome + Sair) para fora do ecrã.
      top: 0, left: 0, height: "100dvh", maxHeight: "100dvh",
      // A barra em si não rola — só a lista de módulos, mais abaixo. Assim o
      // nome e o botão "Sair" ficam sempre à vista, em vez de serem empurrados
      // para fora do ecrã quando há módulos a mais.
      overflow: "hidden",
      zIndex: flutuante ? 96 : undefined,
      boxShadow: flutuante ? "4px 0 24px rgba(0,0,0,0.3)" : undefined,
    }}>
      <div style={{ padding: "0 8px", marginBottom: 22 }}>
        <img src={LOGO_YME_LIGHT} alt="YME" style={{ height: 22, width: "auto" }} />
      </div>

      <div style={{ padding: "0 8px", marginBottom: 22, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 17 }}>Concerto Solidário</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>a favor do IPO</div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", padding: "0 8px", marginBottom: 8 }}>MÓDULOS</div>
      {/* A única zona que rola. `minHeight: 0` é necessário para que um filho
          de um contentor flex possa encolher abaixo do seu conteúdo. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, overflowY: "auto", flex: 1, minHeight: 0 }}>
        {MODULES.map((m) => {
          const Icon = m.icon;
          const isActive = module === m.key;
          return (
            <button
              key={m.key}
              onClick={() => (m.active ? setModuleKey(m.key) : showToast(`${m.label}: módulo a chegar em breve.`))}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9,
                background: isActive ? "rgba(230,23,140,0.16)" : "transparent",
                border: "none", color: isActive ? "#fff" : m.active ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)",
                fontSize: 13.5, fontWeight: isActive ? 600 : 500, cursor: "pointer", textAlign: "left",
                fontFamily: "Inter, sans-serif", width: "100%",
              }}
            >
              <Icon size={15} style={{ flexShrink: 0, color: isActive ? C.accent : "inherit" }} />
              <span style={{ flex: 1 }}>{m.label}</span>
              {!m.active && <span style={{ fontSize: 9.5, background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 5, color: "rgba(255,255,255,0.4)" }}>EM BREVE</span>}
            </button>
          );
        })}

        {/* Terminar sessão fica junto aos módulos, e não só no rodapé: em
            janelas baixas o rodapé podia ficar fora da área visível, e era
            preciso rolar o menu para o encontrar. */}
        {/* Quem está a usar a plataforma, logo acima das ações da própria
            conta — antes ficava no fundo da barra, separado dos botões que
            lhe dizem respeito. */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "9px 10px",
          marginTop: 22, borderTop: "1px solid rgba(255,255,255,0.14)", paddingTop: 18,
        }}>
          <div style={{ width: 26, height: 26, borderRadius: 999, background: soLeitura ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, color: soLeitura ? "rgba(255,255,255,0.6)" : "inherit" }}>
            {soLeitura ? <Eye size={13} /> : user.slice(0, 1).toUpperCase()}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: soLeitura ? "rgba(255,255,255,0.6)" : "inherit" }}>
            {soLeitura ? "Visitante" : user}
          </div>
        </div>

        <BotaoInstalar estilo={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9,
          background: "transparent", border: "none", color: "rgba(255,255,255,0.6)",
          fontSize: 13.5, fontWeight: 500, cursor: "pointer", textAlign: "left",
          fontFamily: "Inter, sans-serif", width: "100%",
        }} />

        {!soLeitura && (
        <button
          onClick={() => setMudarCodigoAberto(true)}
          title="Mudar o meu código de acesso"
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9,
            background: "transparent", border: "none", color: "rgba(255,255,255,0.6)",
            fontSize: 13.5, fontWeight: 500, cursor: "pointer", textAlign: "left",
            fontFamily: "Inter, sans-serif", width: "100%",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <Pencil size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Mudar código</span>
        </button>
        )}

        <button
          onClick={onSair}
          title="Terminar sessão"
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9,
            background: "transparent", border: "none", color: "#FF8A9B",
            fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left",
            fontFamily: "Inter, sans-serif", width: "100%",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,138,155,0.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{soLeitura ? "Voltar à entrada" : "Sair"}</span>
        </button>
      </div>

    </div>

    {/* Fora da barra lateral: lá dentro, o `overflow: hidden` e os 232px de
        largura cortavam o modal e desalinhavam-no. */}
    {mudarCodigoAberto && !soLeitura && (
      <ModalMudarCodigo nome={user} onFechar={() => setMudarCodigoAberto(false)} />
    )}
    </>
  );
}

function ComingSoon({ module }) {
  const Icon = module.icon;
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 480 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: C.grayBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <Icon size={24} color={C.gray} />
        </div>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 19, color: C.ink, marginBottom: 8 }}>{module.label}</div>
        <div style={{ color: C.inkSoft, fontSize: 14, lineHeight: 1.5 }}>
          Este módulo ainda não está disponível nesta primeira versão. A plataforma foi construída para o receber assim que estiver pronto.
        </div>
      </div>
    </div>
  );
}

/* ---------- artistas module ---------- */
function ArtistasModule({ artists, persistArtists, user, members, registerMember, showToast, templates, onResposta, onAddNota, onEditEvento, onConcluirTarefaContacto, soLeitura }) {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterFase, setFilterFase] = useState("Todas");
  const [filterResp, setFilterResp] = useState("Todos");
  const [filterCard, setFilterCard] = useState(null); // null | 'contactados' | 'responderam' | 'naoResponderam'
  const [sortBy, setSortBy] = useState("nome");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete' | 'import'
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // ids selecionados para atribuição em massa
  const [bulkResp, setBulkResp] = useState("");

  const list = artists || [];

  // lista de responsáveis para o filtro: todos os membros da equipa já registados, mais quaisquer
  // nomes de responsável usados nos contactos que ainda não estejam nessa lista (garante que o filtro
  // está sempre completo, mesmo que um responsável ainda não tenha sido formalmente registado)
  const responsaveis = useMemo(() => {
    const s = new Set([...(members || []), ...list.map((a) => a.responsavel).filter(Boolean)]);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [list, members]);

  const filtered = useMemo(() => {
    return list.filter((a) => {
      if (filterEstado !== "Todos" && a.estado !== filterEstado) return false;
      if (filterFase === "Sem fase" && a.fase) return false;
      if (filterFase !== "Todas" && filterFase !== "Sem fase" && a.fase !== filterFase) return false;
      if (filterResp !== "Todos" && a.responsavel !== filterResp) return false;
      if (filterCard === "contactados" && a.estado === ESTADO_NAO_CONTACTADO) return false;
      if (filterCard === "responderam" && !ESTADOS_RESPONDIDOS.includes(a.estado)) return false;
      if (filterCard === "naoResponderam" && a.estado !== ESTADO_AGUARDAR) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const blob = `${a.nome} ${a.agencia} ${a.pessoaContacto} ${a.email}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [list, search, filterEstado, filterFase, filterResp, filterCard]);

  const sorted = useMemo(() => ordenarContactos(filtered, sortBy), [filtered, sortBy]);

  const stats = useMemo(() => {
    const by = (v) => list.filter((a) => a.estado === v).length;
    return {
      total: list.length,
      confirmado: by("Confirmado"),
      positivo: by("Positivo / Disponível"),
      aguardar: by("A aguardar resposta") + by("Por contactar") + by("Pediu mais informações"),
      recusado: by("Recusado"),
      contactados: list.filter((a) => a.estado !== ESTADO_NAO_CONTACTADO).length,
      responderam: list.filter((a) => ESTADOS_RESPONDIDOS.includes(a.estado)).length,
      naoResponderam: by(ESTADO_AGUARDAR),
      aAtrasados: list.filter(followUpAtrasado).length,
    };
  }, [list]);

  // clique num cartão de indicador: filtra a lista por esse estado; clicar novamente no mesmo
  // cartão remove o filtro e volta a mostrar todos os contactos
  const toggleFilterCard = (key) => setFilterCard((f) => (f === key ? null : key));

  // Altera o estado a partir da lista, sem abrir a ficha. Faz exatamente o que
  // o separador "Dados" faz: regista o evento na timeline e, se o contacto
  // deixou de estar "Por contactar", conclui a tarefa de primeiro contacto.
  const alterarEstadoRapido = async (contacto, novoEstado) => {
    if (contacto.estado === novoEstado) return;
    const evento = { id: uid(), tipo: "estado", data: new Date().toISOString(), user, de: contacto.estado, para: novoEstado };
    const atualizado = {
      ...contacto,
      estado: novoEstado,
      historico: [evento, ...(contacto.historico || [])],
      atualizadoPor: user,
    };
    await persistArtists(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    if (novoEstado !== "Por contactar") await onConcluirTarefaContacto?.(contacto.id);
    showToast(`${contacto.nome}: estado alterado para "${novoEstado}".`);
  };

  // Altera a fase a partir da lista. A fase é uma etiqueta de organização da
  // equipa, por isso não gera evento na timeline nem mexe no seguimento.
  const alterarFaseRapido = async (contacto, novaFase) => {
    if ((contacto.fase || "") === novaFase) return;
    const atualizado = { ...contacto, fase: novaFase, atualizadoPor: user };
    await persistArtists(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    showToast(novaFase
      ? `${contacto.nome}: ${novaFase}.`
      : `${contacto.nome}: fase removida.`);
  };

  // Atribui o responsável a partir da lista. Reservado aos líderes, como na
  // ficha. Ao mudar o responsável, a tarefa automática de contacto acompanha
  // (é o syncContactTasks, chamado por persistArtists).
  const alterarResponsavelRapido = async (contacto, novoResponsavel) => {
    if ((contacto.responsavel || "") === novoResponsavel) return;
    const atualizado = { ...contacto, responsavel: novoResponsavel, atualizadoPor: user };
    if (novoResponsavel) registerMember(novoResponsavel);
    await persistArtists(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    showToast(novoResponsavel
      ? `${contacto.nome} atribuído a ${novoResponsavel}.`
      : `${contacto.nome}: responsável removido.`);
  };

  // Altera as datas de contacto a partir da lista. São campos de planeamento,
  // por isso não geram evento na timeline nem mexem no seguimento automático —
  // esse continua a guiar-se pela data do último e-mail efetivamente enviado.
  const alterarDataRapido = async (contacto, campo, novaData) => {
    if ((contacto[campo] || "") === novaData) return;
    const atualizado = { ...contacto, [campo]: novaData, atualizadoPor: user };
    await persistArtists(list.map((x) => (x.id === contacto.id ? atualizado : x)));
  };

  const saveArtist = async (data) => {
    // a mudança de estado já fica registada na timeline em tempo real, assim que é feita no
    // separador "Dados" do modal (ver setEstado em ArtistModal) — aqui só persistimos o histórico
    // tal como o modal o entrega, sem voltar a acrescentar o evento
    const historico = data.historico || [];
    const withMeta = { ...data, historico, atualizadoPor: user, criadoPor: data.criadoPor || user };
    let next;
    if (modal === "add") next = [withMeta, ...list];
    else next = list.map((a) => (a.id === withMeta.id ? withMeta : a));
    if (withMeta.responsavel) registerMember(withMeta.responsavel);
    await persistArtists(next);
    if (withMeta.estado !== "Por contactar") await onConcluirTarefaContacto?.(withMeta.id);
    setModal(null);
    setEditing(null);
    showToast(modal === "add" ? `${withMeta.nome} adicionado.` : `${withMeta.nome} atualizado.`);
  };

  const confirmDelete = async () => {
    const next = list.filter((a) => a.id !== toDelete.id);
    await persistArtists(next);
    showToast(`${toDelete.nome} removido.`);
    setModal(null);
    setToDelete(null);
  };

  // regista automaticamente um envio de email na timeline e ativa o seguimento/follow-up automático
  const registerSend = async (contactId, entry) => {
    const next = list.map((a) => (a.id === contactId ? aplicarEnvioEmailContacto(a, entry) : a));
    await persistArtists(next);
    await onConcluirTarefaContacto?.(contactId);
    showToast(`E-mail registado — "${entry.templateNome}". Contacto passou para "A aguardar resposta".`);
  };

  // reinicia o estado de contacto de todos os artistas para "Por contactar" — usar quando se vai
  // voltar a contactar toda a lista (limpa também o seguimento/follow-up, mas mantém os dados e a timeline)
  const reiniciarEstados = async () => {
    const next = list.map((a) => ({
      ...a,
      estado: "Por contactar",
      aguardaResposta: false,
      faseFollowup: 0,
      dataUltimoEnvio: "",
      dataUltimoContacto: "",
      dataProximoContacto: "",
      atualizadoPor: user,
    }));
    await persistArtists(next);
    setModal(null);
    showToast(`Estado de todos os artistas reiniciado para "Por contactar".`);
  };

  // seleção em massa — alterna a seleção de um único artista, ou de todos os visíveis (filtrados/ordenados)
  const toggleSelect = (id) => setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const todosVisiveisSelecionados = sorted.length > 0 && sorted.every((a) => selectedIds.includes(a.id));
  const toggleSelectAll = () => {
    if (todosVisiveisSelecionados) setSelectedIds((ids) => ids.filter((id) => !sorted.some((a) => a.id === id)));
    else setSelectedIds((ids) => Array.from(new Set([...ids, ...sorted.map((a) => a.id)])));
  };

  // atribui, de uma só vez, o mesmo responsável a todos os artistas selecionados
  const atribuirResponsavelEmMassa = async () => {
    if (!bulkResp || selectedIds.length === 0) return;
    const next = list.map((a) => (selectedIds.includes(a.id) ? { ...a, responsavel: bulkResp, atualizadoPor: user } : a));
    registerMember(bulkResp);
    await persistArtists(next);
    showToast(`${selectedIds.length} artista${selectedIds.length > 1 ? "s" : ""} atribuído${selectedIds.length > 1 ? "s" : ""} a ${bulkResp}.`);
    setSelectedIds([]);
    setBulkResp("");
  };

  // exporta a lista completa de artistas (todos os campos já existentes na plataforma) para Excel
  const exportarArtistas = () => {
    const linhas = list.map((a, idx) => ({
      "Nº": idx + 1,
      "Nome": a.nome || "",
      "Agência": a.agencia || "",
      "Pessoa de contacto": a.pessoaContacto || "",
      "Email": a.email || "",
      "Telefone": a.telefone || "",
      "Responsável": a.responsavel || "",
      "Estado": a.estado || "",
      "Fase": a.fase || "",
      "Último contacto": a.dataUltimoContacto || "",
      "Próximo contacto": a.dataProximoContacto || "",
      "Observações": a.observacoes || "",
    }));
    exportarListaExcel("Artistas", "Artistas", linhas);
    showToast("Lista de artistas exportada para Excel.");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 24, color: C.ink }}>Gestão de Artistas</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={exportarArtistas} style={btnGhost} title="Exportar a lista de artistas para Excel">
            <Download size={15} /> Exportar Excel
          </button>
          {!soLeitura && (
            <>
              <button onClick={() => setModal("reset")} style={btnGhost} title="Voltar a marcar todos os artistas como 'Por contactar', para uma nova ronda de contactos">
                <RotateCcw size={15} /> Reiniciar estados
              </button>
              <button onClick={() => { setEditing(blankArtist()); setModal("add"); }} style={btnPrimary}>
                <Plus size={15} /> Adicionar Artista
              </button>
            </>
          )}
        </div>
      </div>

      <style>{STAT_CARD_CSS}</style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard
          label="Total de contactos" value={stats.total} icon={Users} color={C.ink}
          active={filterCard === null} onClick={() => setFilterCard(null)}
          title="Mostrar todos os artistas"
        />
        <StatCard
          label="Contactados" value={stats.contactados} icon={Send} color={C.teal}
          active={filterCard === "contactados"} onClick={() => toggleFilterCard("contactados")}
          title="Filtrar: artistas já contactados"
        />
        <StatCard
          label="Responderam" value={stats.responderam} icon={Mails} color={C.green}
          active={filterCard === "responderam"} onClick={() => toggleFilterCard("responderam")}
          title="Filtrar: artistas que já responderam"
        />
        <StatCard
          label="Não responderam" value={stats.naoResponderam} icon={Clock} color={C.amber}
          active={filterCard === "naoResponderam"} onClick={() => toggleFilterCard("naoResponderam")}
          title="Filtrar: artistas a aguardar resposta"
        />
      </div>

      {stats.aAtrasados > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10,
          background: C.redBg, color: C.red, fontSize: 12.5, fontWeight: 600, marginBottom: 16,
        }}>
          <AlertTriangle size={14} />
          {stats.aAtrasados} artista{stats.aAtrasados > 1 ? "s" : ""} com seguimento em atraso — a próxima ação já devia ter acontecido.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={15} color={C.gray} style={{ position: "absolute", left: 12, top: 11 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, agência, email…"
            style={{ ...inputStyle, paddingLeft: 34, width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={selectStyle}>
          <option>Todos</option>
          {ESTADOS.map((e) => <option key={e.v}>{e.v}</option>)}
        </select>
        <select value={filterFase} onChange={(e) => setFilterFase(e.target.value)} style={selectStyle} title="Filtrar por fase">
          <option value="Todas">Fase: Todas</option>
          {FASES.map((f) => <option key={f.v} value={f.v}>{f.v}</option>)}
          <option value="Sem fase">Sem fase</option>
        </select>
        <select value={filterResp} onChange={(e) => setFilterResp(e.target.value)} style={selectStyle} title="Filtrar por responsável">
          <option value="Todos">Responsável: Todos</option>
          {responsaveis.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle} title="Ordenar lista">
          {SORT_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
      </div>

      {selectedIds.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: C.grayBg, border: `1px solid ${C.line}`, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{selectedIds.length} artista{selectedIds.length > 1 ? "s" : ""} selecionado{selectedIds.length > 1 ? "s" : ""}</span>
          <select value={bulkResp} onChange={(e) => setBulkResp(e.target.value)} style={{ ...selectStyle, padding: "6px 10px", fontSize: 12.5, width: "auto" }}>
            <option value="">Atribuir a…</option>
            {(members?.length ? members : EQUIPA).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button type="button" disabled={!bulkResp} onClick={atribuirResponsavelEmMassa} style={{ ...btnPrimary, padding: "7px 12px", fontSize: 12.5, opacity: bulkResp ? 1 : 0.5, cursor: bulkResp ? "pointer" : "not-allowed" }}>
            <Users size={13} /> Atribuir responsável
          </button>
          <button type="button" onClick={() => setSelectedIds([])} style={{ ...btnGhost, padding: "7px 12px", fontSize: 12.5 }}>Limpar seleção</button>
        </div>
      )}

      <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
        {sorted.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: C.inkSoft }}>
            <Music2 size={28} color={C.gray} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Sem artistas para mostrar</div>
            <div style={{ fontSize: 13.5 }}>Ajusta os filtros ou adiciona o primeiro artista à lista.</div>
          </div>
        ) : (
          <div className="tabela-scroll" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFBFC", borderBottom: `1px solid ${C.line}` }}>
                  <th style={{ padding: "11px 10px 11px 14px", width: 28 }}>
                    {!soLeitura && isLider(user) && (
                      <CheckboxToggle checked={todosVisiveisSelecionados} onChange={toggleSelectAll} title="Selecionar todos os artistas visíveis" />
                    )}
                  </th>
                  {["Nº", "Artista", "Contacto", "Responsável", "Estado", "Fase", "Último contacto", "Próximo contacto", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "11px 14px", color: C.inkSoft, fontWeight: 600, fontSize: 11.5, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((a, idx) => {
                  const info = estadoInfo(a.estado);
                  const EIcon = info.icon;
                  const atrasado = followUpAtrasado(a);
                  const hojeAcao = followUpHoje(a);
                  return (
                    <tr key={a.id} style={{ borderBottom: `1px solid ${C.line}`, background: atrasado ? C.redBg : undefined }}>
                      <td style={{ padding: "12px 10px 12px 14px", verticalAlign: "top" }}>
                        {!soLeitura && isLider(user) && (
                          <CheckboxToggle checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} title="Selecionar" />
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft, fontSize: 12.5, fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <div
                          onClick={() => { setEditing(a); setModal("edit"); }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setEditing(a); setModal("edit"); } }}
                          title="Abrir ficha"
                          className="nome-clicavel"
                          style={{ fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                        >
                          {a.nome}
                          {atrasado && <AlertTriangle size={13} color={C.red} title="Seguimento em atraso" />}
                        </div>
                        {a.agencia && <div style={{ fontSize: 12, color: C.inkSoft, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><Building2 size={11} />{a.agencia}</div>}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft, maxWidth: 220 }}>
                        {a.pessoaContacto && <div style={{ color: C.ink, fontWeight: 500 }}>{a.pessoaContacto}</div>}
                        {a.email && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}><Mail size={11} />{a.email}</div>}
                        {a.telefone && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginTop: 2 }}><Phone size={11} />{a.telefone}</div>}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <ResponsavelSelect
                          contacto={a}
                          onChange={alterarResponsavelRapido}
                          equipa={members?.length ? members : EQUIPA}
                          podeEditar={!soLeitura && isLider(user)}
                        />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <EstadoSelect contacto={a} onChange={alterarEstadoRapido} disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <FaseSelect contacto={a} onChange={alterarFaseRapido} disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", fontSize: 12.5, whiteSpace: "nowrap" }}>
                        <DataSelect contacto={a} campo="dataUltimoContacto" valor={a.dataUltimoContacto} onChange={alterarDataRapido} etiqueta="Último contacto" disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", fontSize: 12.5, whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <DataSelect contacto={a} campo="dataProximoContacto" valor={a.dataProximoContacto} onChange={alterarDataRapido} etiqueta="Próximo contacto" disabled={soLeitura} />
                          {atrasado && (
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 7px", borderRadius: 999, background: C.redBg, color: C.red, fontSize: 10.5, fontWeight: 700 }}>Atrasado</span>
                          )}
                          {!atrasado && hojeAcao && (
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 7px", borderRadius: 999, background: C.amberBg, color: C.amber, fontSize: 10.5, fontWeight: 700 }}>Hoje</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button onClick={() => { setEditing(a); setModal("edit"); }} style={iconBtn} title={soLeitura ? "Ver ficha" : "Editar"}>
                            {soLeitura ? <Eye size={14} /> : <Pencil size={14} />}
                          </button>
                          {!soLeitura && (
                            <button onClick={() => { setToDelete(a); setModal("delete"); }} style={{ ...iconBtn, color: C.red }} title="Eliminar"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modal === "add" || modal === "edit") && (
        <ArtistModal
          data={editing}
          members={members}
          existingList={list}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={saveArtist}
          isNew={modal === "add"}
          soLeitura={soLeitura}
          templates={templates}
          user={user}
          onSendEmail={registerSend}
          onResposta={onResposta}
          onAddNota={onAddNota}
          onEditEvento={onEditEvento}
        />
      )}

      {modal === "delete" && toDelete && (
        <ConfirmModal
          title="Eliminar artista"
          message={`Tens a certeza que queres eliminar "${toDelete.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Eliminar"
          danger
          onCancel={() => { setModal(null); setToDelete(null); }}
          onConfirm={confirmDelete}
        />
      )}

      {modal === "reset" && (
        <ConfirmModal
          title="Reiniciar estados de contacto"
          message={`Vais repor o estado de todos os ${list.length} artistas para "Por contactar", limpando também as datas de contacto e o seguimento/follow-up. Os dados e a timeline de cada artista mantêm-se. Confirmas?`}
          confirmLabel="Reiniciar"
          danger
          onCancel={() => setModal(null)}
          onConfirm={reiniciarEstados}
        />
      )}

    </div>
  );
}

// Etiqueta de estado que também permite mudá-lo sem abrir a ficha.
//
// Mantém o aspeto da etiqueta colorida, mas por baixo tem um <select> invisível
// que cobre a área toda: mudar o estado de um contacto é a ação mais frequente
// da equipa e obrigava a abrir a ficha, alterar e guardar.
//
// A alteração passa pelo mesmo caminho da ficha (regista o evento na timeline e
// conclui a tarefa de primeiro contacto), para as duas vistas não divergirem.
function EstadoSelect({ contacto, onChange, disabled }) {
  const info = estadoInfo(contacto.estado);
  const EIcon = info.icon;
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 999,
        background: info.bg, color: info.color, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap",
        cursor: disabled ? "default" : "pointer",
      }}>
        <EIcon size={11} /> {contacto.estado}
        {!disabled && <ChevronRight size={10} style={{ transform: "rotate(90deg)", opacity: 0.6 }} />}
      </span>
      {!disabled && (
        <select
          value={contacto.estado}
          onChange={(e) => onChange(contacto, e.target.value)}
          aria-label={`Estado de ${contacto.nome}`}
          title="Alterar estado"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0, cursor: "pointer", border: "none", appearance: "none",
          }}
        >
          {ESTADOS.map((e) => <option key={e.v} value={e.v}>{e.v}</option>)}
        </select>
      )}
    </div>
  );
}

// Etiqueta de fase, editável na lista tal como o estado. Ao contrário do
// estado, um contacto pode não ter fase atribuída.
function FaseSelect({ contacto, onChange, disabled }) {
  const info = faseInfo(contacto.fase);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 999,
        background: info ? info.bg : C.grayBg,
        color: info ? info.color : C.gray,
        fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap",
        fontStyle: info ? "normal" : "italic",
        cursor: disabled ? "default" : "pointer",
      }}>
        {contacto.fase || "sem fase"}
        {!disabled && <ChevronRight size={10} style={{ transform: "rotate(90deg)", opacity: 0.6 }} />}
      </span>
      {!disabled && (
        <select
          value={contacto.fase || ""}
          onChange={(e) => onChange(contacto, e.target.value)}
          aria-label={`Fase de ${contacto.nome}`}
          title="Alterar fase"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0, cursor: "pointer", border: "none", appearance: "none",
          }}
        >
          <option value="">Sem fase</option>
          {FASES.map((f) => <option key={f.v} value={f.v}>{f.v}</option>)}
        </select>
      )}
    </div>
  );
}

// Responsável, editável na lista por quem tem permissão para atribuir.
//
// Só os líderes de equipa podem atribuir trabalho, por isso os restantes veem
// apenas o nome. Atribuir contactos é das ações mais frequentes de quem
// coordena e obrigava a abrir a ficha de cada um.
function ResponsavelSelect({ contacto, onChange, equipa, podeEditar }) {
  if (!podeEditar) {
    return contacto.responsavel ? (
      <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 500 }}>{contacto.responsavel}</span>
    ) : (
      <span style={{ fontSize: 12.5, color: C.gray, fontStyle: "italic" }}>por atribuir</span>
    );
  }
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5,
        color: contacto.responsavel ? C.ink : C.gray,
        fontWeight: contacto.responsavel ? 500 : 400,
        fontStyle: contacto.responsavel ? "normal" : "italic",
        whiteSpace: "nowrap", cursor: "pointer",
      }}>
        {contacto.responsavel || "por atribuir"}
        <ChevronRight size={10} style={{ transform: "rotate(90deg)", opacity: 0.5 }} />
      </span>
      <select
        value={contacto.responsavel || ""}
        onChange={(e) => onChange(contacto, e.target.value)}
        aria-label={`Responsável por ${contacto.nome}`}
        title="Atribuir responsável"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          opacity: 0, cursor: "pointer", border: "none", appearance: "none",
        }}
      >
        <option value="">Por atribuir</option>
        {equipa.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  );
}

// Data editável na lista (último e próximo contacto).
//
// O <input type="date"> fica invisível por cima do texto, como nos restantes
// campos editáveis da lista: mantém o aspeto da tabela e abre o calendário do
// browser ao clicar.
function DataSelect({ contacto, campo, valor, onChange, etiqueta, disabled }) {
  if (disabled) {
    return (
      <span style={{ fontSize: 12.5, whiteSpace: "nowrap", color: valor ? C.inkSoft : C.gray }}>
        {valor || "—"}
      </span>
    );
  }
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{
        fontSize: 12.5, whiteSpace: "nowrap", cursor: "pointer",
        color: valor ? C.inkSoft : C.gray,
        fontStyle: valor ? "normal" : "italic",
      }}>
        {valor || "definir"}
      </span>
      <input
        type="date"
        value={valor || ""}
        onChange={(e) => onChange(contacto, campo, e.target.value)}
        aria-label={`${etiqueta} de ${contacto.nome}`}
        title={etiqueta}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          opacity: 0, cursor: "pointer", border: "none", padding: 0,
        }}
      />
    </div>
  );
}

// checkbox simples usado na seleção em massa das listas de contactos (Artistas, Espaços, Parceiros) —
// mantém a linguagem visual da plataforma, reutilizando os ícones Square / CheckSquare já importados
function CheckboxToggle({ checked, onChange, title }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      title={title}
      style={{ border: "none", background: "transparent", padding: 4, margin: -4, cursor: "pointer", display: "flex", alignItems: "center", color: checked ? C.accent : C.gray }}
    >
      {checked ? <CheckSquare size={16} /> : <Square size={16} />}
    </button>
  );
}

// cartão de indicador — quando recebe onClick, torna-se um filtro rápido clicável: um novo clique
// no mesmo cartão (active=true) remove o filtro e volta a mostrar todos os contactos
function StatCard({ label, value, icon: Icon, color, onClick, active, title }) {
  const clickable = typeof onClick === "function";
  return (
    <div
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      title={title}
      onKeyDown={clickable ? (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); }
      } : undefined}
      className={clickable ? "stat-card-clickable" : undefined}
      style={{
        background: active ? `${color}17` : C.panel,
        border: `1px solid ${active ? color : C.line}`,
        borderRadius: 12,
        padding: "14px 16px",
        transition: "border-color .15s ease, background .15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, fontFamily: "Space Grotesk, sans-serif" }}>{value}</div>
          <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
            {label}
            {active && <X size={11} color={color} />}
          </div>
        </div>
        <Icon size={17} color={color} />
      </div>
    </div>
  );
}

/* ---------- espaços module ---------- */
function EspacosModule({ spaces, persistSpaces, user, members, registerMember, showToast, templates, onResposta, onAddNota, onEditEvento, onConcluirTarefaContacto, soLeitura }) {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterFase, setFilterFase] = useState("Todas");
  const [filterResp, setFilterResp] = useState("Todos");
  const [filterCard, setFilterCard] = useState(null); // null | 'contactados' | 'responderam' | 'naoResponderam'
  const [sortBy, setSortBy] = useState("nome");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete' | 'import'
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // ids selecionados para atribuição em massa
  const [bulkResp, setBulkResp] = useState("");

  const list = spaces || [];

  // lista de responsáveis para o filtro: todos os membros da equipa já registados, mais quaisquer
  // nomes de responsável usados nos contactos que ainda não estejam nessa lista (garante que o filtro
  // está sempre completo, mesmo que um responsável ainda não tenha sido formalmente registado)
  const responsaveis = useMemo(() => {
    const s = new Set([...(members || []), ...list.map((a) => a.responsavel).filter(Boolean)]);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [list, members]);

  const filtered = useMemo(() => {
    return list.filter((a) => {
      if (filterEstado !== "Todos" && a.estado !== filterEstado) return false;
      if (filterFase === "Sem fase" && a.fase) return false;
      if (filterFase !== "Todas" && filterFase !== "Sem fase" && a.fase !== filterFase) return false;
      if (filterResp !== "Todos" && a.responsavel !== filterResp) return false;
      if (filterCard === "contactados" && a.estado === ESTADO_NAO_CONTACTADO) return false;
      if (filterCard === "responderam" && !ESTADOS_RESPONDIDOS.includes(a.estado)) return false;
      if (filterCard === "naoResponderam" && a.estado !== ESTADO_AGUARDAR) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const blob = `${a.nome} ${a.cidade} ${a.pessoaContacto} ${a.email}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [list, search, filterEstado, filterFase, filterResp, filterCard]);

  const sorted = useMemo(() => ordenarContactos(filtered, sortBy), [filtered, sortBy]);

  const stats = useMemo(() => {
    const by = (v) => list.filter((a) => a.estado === v).length;
    return {
      total: list.length,
      confirmado: by("Confirmado"),
      positivo: by("Positivo / Disponível"),
      aguardar: by("A aguardar resposta") + by("Por contactar") + by("Pediu mais informações"),
      recusado: by("Recusado"),
      contactados: list.filter((a) => a.estado !== ESTADO_NAO_CONTACTADO).length,
      responderam: list.filter((a) => ESTADOS_RESPONDIDOS.includes(a.estado)).length,
      naoResponderam: by(ESTADO_AGUARDAR),
      aAtrasados: list.filter(followUpAtrasado).length,
    };
  }, [list]);

  const toggleFilterCard = (key) => setFilterCard((f) => (f === key ? null : key));

  // Altera o estado a partir da lista, sem abrir a ficha. Faz exatamente o que
  // o separador "Dados" faz: regista o evento na timeline e, se o contacto
  // deixou de estar "Por contactar", conclui a tarefa de primeiro contacto.
  const alterarEstadoRapido = async (contacto, novoEstado) => {
    if (contacto.estado === novoEstado) return;
    const evento = { id: uid(), tipo: "estado", data: new Date().toISOString(), user, de: contacto.estado, para: novoEstado };
    const atualizado = {
      ...contacto,
      estado: novoEstado,
      historico: [evento, ...(contacto.historico || [])],
      atualizadoPor: user,
    };
    await persistSpaces(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    if (novoEstado !== "Por contactar") await onConcluirTarefaContacto?.(contacto.id);
    showToast(`${contacto.nome}: estado alterado para "${novoEstado}".`);
  };

  // Altera a fase a partir da lista. A fase é uma etiqueta de organização da
  // equipa, por isso não gera evento na timeline nem mexe no seguimento.
  const alterarFaseRapido = async (contacto, novaFase) => {
    if ((contacto.fase || "") === novaFase) return;
    const atualizado = { ...contacto, fase: novaFase, atualizadoPor: user };
    await persistSpaces(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    showToast(novaFase
      ? `${contacto.nome}: ${novaFase}.`
      : `${contacto.nome}: fase removida.`);
  };

  // Atribui o responsável a partir da lista. Reservado aos líderes, como na
  // ficha. Ao mudar o responsável, a tarefa automática de contacto acompanha
  // (é o syncContactTasks, chamado por persistSpaces).
  const alterarResponsavelRapido = async (contacto, novoResponsavel) => {
    if ((contacto.responsavel || "") === novoResponsavel) return;
    const atualizado = { ...contacto, responsavel: novoResponsavel, atualizadoPor: user };
    if (novoResponsavel) registerMember(novoResponsavel);
    await persistSpaces(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    showToast(novoResponsavel
      ? `${contacto.nome} atribuído a ${novoResponsavel}.`
      : `${contacto.nome}: responsável removido.`);
  };

  // Altera as datas de contacto a partir da lista. São campos de planeamento,
  // por isso não geram evento na timeline nem mexem no seguimento automático —
  // esse continua a guiar-se pela data do último e-mail efetivamente enviado.
  const alterarDataRapido = async (contacto, campo, novaData) => {
    if ((contacto[campo] || "") === novaData) return;
    const atualizado = { ...contacto, [campo]: novaData, atualizadoPor: user };
    await persistSpaces(list.map((x) => (x.id === contacto.id ? atualizado : x)));
  };

  const saveSpace = async (data) => {
    // a mudança de estado já fica registada na timeline em tempo real, assim que é feita no
    // separador "Dados" do modal (ver setEstado em EspacoModal) — aqui só persistimos o histórico
    // tal como o modal o entrega, sem voltar a acrescentar o evento
    const historico = data.historico || [];
    const withMeta = { ...data, historico, atualizadoPor: user, criadoPor: data.criadoPor || user };
    let next;
    if (modal === "add") next = [withMeta, ...list];
    else next = list.map((a) => (a.id === withMeta.id ? withMeta : a));
    if (withMeta.responsavel) registerMember(withMeta.responsavel);
    await persistSpaces(next);
    if (withMeta.estado !== "Por contactar") await onConcluirTarefaContacto?.(withMeta.id);
    setModal(null);
    setEditing(null);
    showToast(modal === "add" ? `${withMeta.nome} adicionado.` : `${withMeta.nome} atualizado.`);
  };

  const confirmDelete = async () => {
    const next = list.filter((a) => a.id !== toDelete.id);
    await persistSpaces(next);
    showToast(`${toDelete.nome} removido.`);
    setModal(null);
    setToDelete(null);
  };

  // regista automaticamente um envio de email na timeline e ativa o seguimento/follow-up automático
  const registerSend = async (contactId, entry) => {
    const next = list.map((a) => (a.id === contactId ? aplicarEnvioEmailContacto(a, entry) : a));
    await persistSpaces(next);
    await onConcluirTarefaContacto?.(contactId);
    showToast(`E-mail registado — "${entry.templateNome}". Contacto passou para "A aguardar resposta".`);
  };

  // reinicia o estado de contacto de todos os espaços para "Por contactar" — usar quando se vai
  // voltar a contactar toda a lista (limpa também o seguimento/follow-up, mas mantém os dados e a timeline)
  const reiniciarEstados = async () => {
    const next = list.map((a) => ({
      ...a,
      estado: "Por contactar",
      aguardaResposta: false,
      faseFollowup: 0,
      dataUltimoEnvio: "",
      dataUltimoContacto: "",
      dataProximoContacto: "",
      atualizadoPor: user,
    }));
    await persistSpaces(next);
    setModal(null);
    showToast(`Estado de todos os espaços reiniciado para "Por contactar".`);
  };

  // seleção em massa — alterna a seleção de um único espaço, ou de todos os visíveis (filtrados/ordenados)
  const toggleSelect = (id) => setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const todosVisiveisSelecionados = sorted.length > 0 && sorted.every((a) => selectedIds.includes(a.id));
  const toggleSelectAll = () => {
    if (todosVisiveisSelecionados) setSelectedIds((ids) => ids.filter((id) => !sorted.some((a) => a.id === id)));
    else setSelectedIds((ids) => Array.from(new Set([...ids, ...sorted.map((a) => a.id)])));
  };

  // atribui, de uma só vez, o mesmo responsável a todos os espaços selecionados
  const atribuirResponsavelEmMassa = async () => {
    if (!bulkResp || selectedIds.length === 0) return;
    const next = list.map((a) => (selectedIds.includes(a.id) ? { ...a, responsavel: bulkResp, atualizadoPor: user } : a));
    registerMember(bulkResp);
    await persistSpaces(next);
    showToast(`${selectedIds.length} espaço${selectedIds.length > 1 ? "s" : ""} atribuído${selectedIds.length > 1 ? "s" : ""} a ${bulkResp}.`);
    setSelectedIds([]);
    setBulkResp("");
  };

  // exporta a lista completa de espaços (todos os campos já existentes na plataforma) para Excel
  const exportarEspacos = () => {
    const linhas = list.map((a, idx) => ({
      "Nº": idx + 1,
      "Nome": a.nome || "",
      "Cidade": a.cidade || "",
      "Capacidade": a.capacidade || "",
      "Pessoa de contacto": a.pessoaContacto || "",
      "Email": a.email || "",
      "Telefone": a.telefone || "",
      "Responsável": a.responsavel || "",
      "Estado": a.estado || "",
      "Fase": a.fase || "",
      "Último contacto": a.dataUltimoContacto || "",
      "Próximo contacto": a.dataProximoContacto || "",
      "Observações": a.observacoes || "",
    }));
    exportarListaExcel("Espaços", "Espaços", linhas);
    showToast("Lista de espaços exportada para Excel.");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 24, color: C.ink }}>Gestão de Espaços</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={exportarEspacos} style={btnGhost} title="Exportar a lista de espaços para Excel">
            <Download size={15} /> Exportar Excel
          </button>
          {!soLeitura && (
            <>
              <button onClick={() => setModal("reset")} style={btnGhost} title="Voltar a marcar todos os espaços como 'Por contactar', para uma nova ronda de contactos">
                <RotateCcw size={15} /> Reiniciar estados
              </button>
              <button onClick={() => { setEditing(blankSpace()); setModal("add"); }} style={btnPrimary}>
                <Plus size={15} /> Adicionar Espaço
              </button>
            </>
          )}
        </div>
      </div>

      <style>{STAT_CARD_CSS}</style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard
          label="Total de contactos" value={stats.total} icon={MapPin} color={C.ink}
          active={filterCard === null} onClick={() => setFilterCard(null)}
          title="Mostrar todos os espaços"
        />
        <StatCard
          label="Contactados" value={stats.contactados} icon={Send} color={C.teal}
          active={filterCard === "contactados"} onClick={() => toggleFilterCard("contactados")}
          title="Filtrar: espaços já contactados"
        />
        <StatCard
          label="Responderam" value={stats.responderam} icon={Mails} color={C.green}
          active={filterCard === "responderam"} onClick={() => toggleFilterCard("responderam")}
          title="Filtrar: espaços que já responderam"
        />
        <StatCard
          label="Não responderam" value={stats.naoResponderam} icon={Clock} color={C.amber}
          active={filterCard === "naoResponderam"} onClick={() => toggleFilterCard("naoResponderam")}
          title="Filtrar: espaços a aguardar resposta"
        />
      </div>

      {stats.aAtrasados > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10,
          background: C.redBg, color: C.red, fontSize: 12.5, fontWeight: 600, marginBottom: 16,
        }}>
          <AlertTriangle size={14} />
          {stats.aAtrasados} espaço{stats.aAtrasados > 1 ? "s" : ""} com seguimento em atraso — a próxima ação já devia ter acontecido.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={15} color={C.gray} style={{ position: "absolute", left: 12, top: 11 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, cidade, email…"
            style={{ ...inputStyle, paddingLeft: 34, width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={selectStyle}>
          <option>Todos</option>
          {ESTADOS.map((e) => <option key={e.v}>{e.v}</option>)}
        </select>
        <select value={filterFase} onChange={(e) => setFilterFase(e.target.value)} style={selectStyle} title="Filtrar por fase">
          <option value="Todas">Fase: Todas</option>
          {FASES.map((f) => <option key={f.v} value={f.v}>{f.v}</option>)}
          <option value="Sem fase">Sem fase</option>
        </select>
        <select value={filterResp} onChange={(e) => setFilterResp(e.target.value)} style={selectStyle} title="Filtrar por responsável">
          <option value="Todos">Responsável: Todos</option>
          {responsaveis.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle} title="Ordenar lista">
          {SORT_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
      </div>

      {selectedIds.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: C.grayBg, border: `1px solid ${C.line}`, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{selectedIds.length} espaço{selectedIds.length > 1 ? "s" : ""} selecionado{selectedIds.length > 1 ? "s" : ""}</span>
          <select value={bulkResp} onChange={(e) => setBulkResp(e.target.value)} style={{ ...selectStyle, padding: "6px 10px", fontSize: 12.5, width: "auto" }}>
            <option value="">Atribuir a…</option>
            {(members?.length ? members : EQUIPA).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button type="button" disabled={!bulkResp} onClick={atribuirResponsavelEmMassa} style={{ ...btnPrimary, padding: "7px 12px", fontSize: 12.5, opacity: bulkResp ? 1 : 0.5, cursor: bulkResp ? "pointer" : "not-allowed" }}>
            <Users size={13} /> Atribuir responsável
          </button>
          <button type="button" onClick={() => setSelectedIds([])} style={{ ...btnGhost, padding: "7px 12px", fontSize: 12.5 }}>Limpar seleção</button>
        </div>
      )}

      <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
        {sorted.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: C.inkSoft }}>
            <MapPin size={28} color={C.gray} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Sem espaços para mostrar</div>
            <div style={{ fontSize: 13.5 }}>Ajusta os filtros ou adiciona o primeiro espaço à lista.</div>
          </div>
        ) : (
          <div className="tabela-scroll" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFBFC", borderBottom: `1px solid ${C.line}` }}>
                  <th style={{ padding: "11px 10px 11px 14px", width: 28 }}>
                    {!soLeitura && isLider(user) && (
                      <CheckboxToggle checked={todosVisiveisSelecionados} onChange={toggleSelectAll} title="Selecionar todos os espaços visíveis" />
                    )}
                  </th>
                  {["Nº", "Espaço", "Cidade", "Contacto", "Capacidade", "Responsável", "Estado", "Fase", "Último contacto", "Próximo contacto", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "11px 14px", color: C.inkSoft, fontWeight: 600, fontSize: 11.5, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((a, idx) => {
                  const info = estadoInfo(a.estado);
                  const EIcon = info.icon;
                  const atrasado = followUpAtrasado(a);
                  const hojeAcao = followUpHoje(a);
                  return (
                    <tr key={a.id} style={{ borderBottom: `1px solid ${C.line}`, background: atrasado ? C.redBg : undefined }}>
                      <td style={{ padding: "12px 10px 12px 14px", verticalAlign: "top" }}>
                        {!soLeitura && isLider(user) && (
                          <CheckboxToggle checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} title="Selecionar" />
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft, fontSize: 12.5, fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <div
                          onClick={() => { setEditing(a); setModal("edit"); }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setEditing(a); setModal("edit"); } }}
                          title="Abrir ficha"
                          className="nome-clicavel"
                          style={{ fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                        >
                          {a.nome}
                          {atrasado && <AlertTriangle size={13} color={C.red} title="Seguimento em atraso" />}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft }}>
                        {a.cidade && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5 }}><MapPin size={11} />{a.cidade}</div>}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft, maxWidth: 220 }}>
                        {a.pessoaContacto && <div style={{ color: C.ink, fontWeight: 500 }}>{a.pessoaContacto}</div>}
                        {a.email && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}><Mail size={11} />{a.email}</div>}
                        {a.telefone && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginTop: 2 }}><Phone size={11} />{a.telefone}</div>}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft, fontSize: 12.5, whiteSpace: "nowrap" }}>{a.capacidade || "—"}</td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <ResponsavelSelect
                          contacto={a}
                          onChange={alterarResponsavelRapido}
                          equipa={members?.length ? members : EQUIPA}
                          podeEditar={!soLeitura && isLider(user)}
                        />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <EstadoSelect contacto={a} onChange={alterarEstadoRapido} disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <FaseSelect contacto={a} onChange={alterarFaseRapido} disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", fontSize: 12.5, whiteSpace: "nowrap" }}>
                        <DataSelect contacto={a} campo="dataUltimoContacto" valor={a.dataUltimoContacto} onChange={alterarDataRapido} etiqueta="Último contacto" disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", fontSize: 12.5, whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <DataSelect contacto={a} campo="dataProximoContacto" valor={a.dataProximoContacto} onChange={alterarDataRapido} etiqueta="Próximo contacto" disabled={soLeitura} />
                          {atrasado && (
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 7px", borderRadius: 999, background: C.redBg, color: C.red, fontSize: 10.5, fontWeight: 700 }}>Atrasado</span>
                          )}
                          {!atrasado && hojeAcao && (
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 7px", borderRadius: 999, background: C.amberBg, color: C.amber, fontSize: 10.5, fontWeight: 700 }}>Hoje</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button onClick={() => { setEditing(a); setModal("edit"); }} style={iconBtn} title={soLeitura ? "Ver ficha" : "Editar"}>
                            {soLeitura ? <Eye size={14} /> : <Pencil size={14} />}
                          </button>
                          {!soLeitura && (
                            <button onClick={() => { setToDelete(a); setModal("delete"); }} style={{ ...iconBtn, color: C.red }} title="Eliminar"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modal === "add" || modal === "edit") && (
        <EspacoModal
          data={editing}
          members={members}
          existingList={list}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={saveSpace}
          isNew={modal === "add"}
          soLeitura={soLeitura}
          templates={templates}
          user={user}
          onSendEmail={registerSend}
          onResposta={onResposta}
          onAddNota={onAddNota}
          onEditEvento={onEditEvento}
        />
      )}

      {modal === "delete" && toDelete && (
        <ConfirmModal
          title="Eliminar espaço"
          message={`Tens a certeza que queres eliminar "${toDelete.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Eliminar"
          danger
          onCancel={() => { setModal(null); setToDelete(null); }}
          onConfirm={confirmDelete}
        />
      )}

      {modal === "reset" && (
        <ConfirmModal
          title="Reiniciar estados de contacto"
          message={`Vais repor o estado de todos os ${list.length} espaços para "Por contactar", limpando também as datas de contacto e o seguimento/follow-up. Os dados e a timeline de cada espaço mantêm-se. Confirmas?`}
          confirmLabel="Reiniciar"
          danger
          onCancel={() => setModal(null)}
          onConfirm={reiniciarEstados}
        />
      )}

    </div>
  );
}

/* ---------- secção "Comunicação" partilhada por Artistas, Espaços e Parceiros ---------- */
/* permite escolher um template, ver a prévia já preenchida com os dados do contacto, editar antes de enviar e enviar o email */
function ComunicacaoTab({ tipo, contact, templates, user, onSend, showToast, remetente }) {
  const tipoInfo = TIPOS_CONTACTO[tipo] || {};
  const categoriaDefault = tipoInfo.categoriaTemplate || "Todas";
  const list = templates || [];

  const [filterCategoria, setFilterCategoria] = useState(categoriaDefault);
  const templatesFiltrados = useMemo(
    () => list.filter((t) => filterCategoria === "Todas" || t.categoria === filterCategoria),
    [list, filterCategoria]
  );

  const [selectedId, setSelectedId] = useState("");
  // seleciona automaticamente o primeiro template disponível (da categoria sugerida) quando a lista muda
  useEffect(() => {
    if (templatesFiltrados.length === 0) { setSelectedId(""); return; }
    if (!templatesFiltrados.some((t) => t.id === selectedId)) {
      setSelectedId(templatesFiltrados[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templatesFiltrados]);

  const selected = list.find((t) => t.id === selectedId) || null;

  const [innerTab, setInnerTab] = useState("editar"); // 'editar' | 'preview'
  const [assunto, setAssunto] = useState("");
  const [corpoState, setCorpoState] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  // sempre que se muda de template, preenche o assunto/corpo com os dados reais do contacto (ainda editável depois)
  useEffect(() => {
    if (selected) {
      const filled = aplicarVariaveisContacto(selected.assunto, selected.corpo, contact, tipo, remetente);
      setAssunto(filled.assunto);
      setCorpoState(filled.corpo);
    } else {
      setAssunto("");
      setCorpoState("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // sincroniza o editor sempre que voltamos à tab "editar"
  useEffect(() => {
    if (innerTab === "editar" && bodyRef.current) {
      bodyRef.current.innerHTML = corpoState || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerTab, selectedId]);

  const format = (cmd) => {
    if (!bodyRef.current) return;
    bodyRef.current.focus();
    document.execCommand(cmd, false, null);
    setCorpoState(bodyRef.current.innerHTML);
  };

  const semEmail = !contact?.email;
  const podeEnviar = !!selected && !semEmail && assunto.trim() && !sending;

  const handleSend = async () => {
    if (!podeEnviar) return;
    const corpoFinal = bodyRef.current ? bodyRef.current.innerHTML : corpoState;
    setSending(true);
    try {
      const texto = htmlParaTexto(corpoFinal);
      abrirMailto(contact.email, assunto, texto);
      const entry = criarRegistoEnvio({ template: selected, assunto, corpo: corpoFinal, user });
      await onSend(entry);
    } finally {
      setSending(false);
    }
  };

  if (list.length === 0) {
    return (
      <div style={{ padding: "40px 24px", textAlign: "center", color: C.inkSoft }}>
        <Mails size={26} color={C.gray} style={{ marginBottom: 10 }} />
        <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Ainda não há templates de email</div>
        <div style={{ fontSize: 13.5 }}>Cria um template no módulo "Templates de Email" para poderes comunicar com este contacto a partir daqui.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "18px 24px", maxHeight: "58vh", overflowY: "auto" }}>
      {semEmail && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 9, background: C.amberBg, color: C.amber, fontSize: 12.5, fontWeight: 500, marginBottom: 14 }}>
          <AlertTriangle size={14} /> Este contacto não tem um email definido — adiciona um na secção "Dados" para poderes enviar.
        </div>
      )}

      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Field label="Categoria do template">
          <select style={selectStyle} value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)}>
            <option value="Todas">Todas as categorias</option>
            {CATEGORIAS_TEMPLATES.map((c) => <option key={c.v} value={c.v}>{c.v}</option>)}
          </select>
        </Field>
        <Field label="Template">
          <select style={selectStyle} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {templatesFiltrados.length === 0 && <option value="">Sem templates nesta categoria</option>}
            {templatesFiltrados.map((t) => (
              <option key={t.id} value={t.id}>{t.fase ? `Fase ${t.fase} — ` : ""}{t.nome}</option>
            ))}
          </select>
        </Field>
      </div>

      {selected && (
        <>
          <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.line}`, marginBottom: 14 }}>
            <button type="button" onClick={() => setInnerTab("editar")} style={tabBtn(innerTab === "editar")}>Editar</button>
            <button type="button" onClick={() => setInnerTab("preview")} style={tabBtn(innerTab === "preview")}>
              <Eye size={13} /> Pré-visualização
            </button>
          </div>

          {innerTab === "editar" ? (
            <>
              <Field label="Assunto do e-mail">
                <input style={inputStyle} value={assunto} onChange={(e) => setAssunto(e.target.value)} />
              </Field>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.inkSoft, margin: "12px 0 5px" }}>Corpo do e-mail</label>
              <div style={{ border: `1px solid ${C.line}`, borderRadius: 9, overflow: "hidden" }}>
                <div style={{ display: "flex", gap: 2, padding: 6, background: "#FAFBFC", borderBottom: `1px solid ${C.line}` }}>
                  <button type="button" onClick={() => format("bold")} style={toolBtn} title="Negrito"><Bold size={14} /></button>
                  <button type="button" onClick={() => format("italic")} style={toolBtn} title="Itálico"><Italic size={14} /></button>
                  <button type="button" onClick={() => format("underline")} style={toolBtn} title="Sublinhado"><Underline size={14} /></button>
                  <button type="button" onClick={() => format("insertUnorderedList")} style={toolBtn} title="Lista"><List size={14} /></button>
                </div>
                <div
                  ref={bodyRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setCorpoState(e.currentTarget.innerHTML)}
                  style={{ minHeight: 160, padding: "12px 14px", fontSize: 13.5, fontFamily: "Inter, sans-serif", color: C.ink, outline: "none", lineHeight: 1.6 }}
                />
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: C.inkSoft, lineHeight: 1.5 }}>
                As variáveis do template já foram substituídas pelos dados deste contacto. Podes editar livremente o texto antes de enviar.
              </div>
            </>
          ) : (
            <TemplatePreviewContent assunto={assunto} corpo={bodyRef.current ? bodyRef.current.innerHTML : corpoState} />
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button type="button" onClick={handleSend} disabled={!podeEnviar} style={{ ...btnPrimary, opacity: podeEnviar ? 1 : 0.5, cursor: podeEnviar ? "pointer" : "not-allowed" }}>
              <Send size={15} /> {sending ? "A abrir cliente de email…" : "Enviar E-mail"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Timeline — elemento principal da ficha de Artistas, Espaços e Parceiros ---------- */
// timeline unificada e visual de um contacto: emails enviados, follow-ups automáticos, respostas,
// alterações de estado, notas e tarefas concluídas — agrupada por dia, por ordem cronológica.
// Cada acontecimento é clicável e abre um painel com as observações/detalhes desse evento —
// as observações nunca ficam visíveis por defeito na própria timeline.
const TIMELINE_CSS = `
.tl-item { position: relative; cursor: pointer; }
.tl-item .tl-card { transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease; }
.tl-item:hover .tl-card { border-color: #D8DCE2; box-shadow: 0 6px 16px rgba(21,26,36,0.08); transform: translateX(2px); }
.tl-item .tl-dot { transition: transform .15s ease; }
.tl-item:hover .tl-dot { transform: scale(1.12); }
`;

// estilos dos cartões de indicadores (StatCard) quando são interativos/clicáveis — usado nos
// topos dos módulos de Artistas, Espaços e Parceiros para filtrar a lista por estado do contacto
const STAT_CARD_CSS = `
.stat-card-clickable { cursor: pointer; }
.stat-card-clickable:hover { box-shadow: 0 6px 16px rgba(21,26,36,0.09); transform: translateY(-1px); }
.stat-card-clickable:focus-visible { outline: 2px solid #9AA6FF; outline-offset: 2px; }
`;

// título curto de cada tipo de acontecimento (o que aparece sempre visível na timeline)
const tituloEventoTimeline = (h, tipo, meta) => {
  switch (tipo) {
    case "email": return h.assunto || "(sem assunto)";
    case "primeiro_contacto": return "Primeiro contacto registado — seguimento iniciado";
    case "followup_criado": return `Follow-up criado — Fase ${h.fase}${h.templateNome ? ` (${h.templateNome})` : ""}`;
    case "followup_auto": return `Follow-up automático criado — Fase ${h.fase}${h.templateNome ? ` (${h.templateNome})` : ""} (sem resposta em ${h.dias} dias)`;
    case "resposta": return "Resposta recebida do contacto";
    case "estado": return `Estado alterado de "${h.de}" para "${h.para}"`;
    case "tarefa_concluida": return `Tarefa concluída: ${h.tarefaTitulo}`;
    case "nota": return "Nota adicionada";
    default: return meta.label;
  }
};

// indica se um acontecimento tem observações/conteúdo próprio, só visível ao abrir o painel de detalhe
const temObservacoesEvento = (h, tipo) => (tipo === "email" && !!(h.assunto || h.corpo)) || (tipo === "nota" && !!h.texto);

function Timeline({ historico, onEditEvento }) {
  const [selecionadoId, setSelecionadoId] = useState(null);
  const list = (historico || []).slice().sort((a, b) => new Date(b.data) - new Date(a.data));
  const selecionado = selecionadoId ? list.find((h) => h.id === selecionadoId) : null;

  if (list.length === 0) {
    return (
      <div style={{ padding: "70px 24px", textAlign: "center", color: C.inkSoft }}>
        <Clock size={30} color={C.gray} style={{ marginBottom: 12 }} />
        <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4, fontSize: 15 }}>Ainda sem eventos registados</div>
        <div style={{ fontSize: 13.5, maxWidth: 380, margin: "0 auto", lineHeight: 1.5 }}>
          Emails enviados, follow-ups automáticos, respostas, alterações de estado e notas vão aparecer aqui, organizados cronologicamente por dia.
        </div>
      </div>
    );
  }

  // agrupar por dia, para tornar a leitura cronológica mais fácil
  const grupos = [];
  list.forEach((h) => {
    const diaChave = new Date(h.data).toISOString().slice(0, 10);
    let g = grupos.find((g) => g.diaChave === diaChave);
    if (!g) { g = { diaChave, data: h.data, items: [] }; grupos.push(g); }
    g.items.push(h);
  });

  return (
    <div style={{ padding: "22px 26px 28px", maxHeight: "66vh", overflowY: "auto" }}>
      <style>{TIMELINE_CSS}</style>
      {grupos.map((g, gi) => (
        <div key={g.diaChave} style={{ marginBottom: gi === grupos.length - 1 ? 0 : 26 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, color: C.inkSoft, textTransform: "uppercase", marginBottom: 14, paddingLeft: 46 }}>
            {new Date(g.data).toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 15, top: 4, bottom: 4, width: 2, background: C.line }} />
            {g.items.map((h) => {
              const tipo = h.tipo || "email";
              const meta = TIMELINE_TIPOS[tipo] || TIMELINE_TIPOS.email;
              const Icon = meta.icon;
              const hora = new Date(h.data).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
              const autor = h.enviadoPor || h.user || "—";
              const titulo = tituloEventoTimeline(h, tipo, meta);
              const observavel = temObservacoesEvento(h, tipo);

              return (
                <div key={h.id} className="tl-item" onClick={() => setSelecionadoId(h.id)} style={{ display: "flex", gap: 14, paddingBottom: 16 }}>
                  <div className="tl-dot" style={{ width: 32, height: 32, borderRadius: 999, background: meta.bg, color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, border: `2px solid ${C.panel}` }}>
                    <Icon size={15} />
                  </div>
                  <div className="tl-card" style={{ flex: 1, minWidth: 0, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", background: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: C.ink, lineHeight: 1.35 }}>{titulo}</div>
                        <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 5, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={10} />{hora}</span>
                          <span>·</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><UserCircle2 size={10} />{autor}</span>
                          {observavel && (
                            <>
                              <span>·</span>
                              <span style={{ color: C.accent, fontWeight: 600 }}>ver observações</span>
                            </>
                          )}
                          {h.editadoPor && (
                            <>
                              <span>·</span>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontStyle: "italic" }}><Pencil size={9} />editado</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} color={C.gray} style={{ flexShrink: 0, marginTop: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selecionado && (
        <TimelineEventModal evento={selecionado} onClose={() => setSelecionadoId(null)} onEdit={onEditEvento} />
      )}
    </div>
  );
}

// painel de detalhe de um acontecimento da timeline — só aqui é que as observações/comentários
// associados ao acontecimento ficam visíveis (nunca por defeito na própria timeline). Quando o
// acontecimento tem observações próprias (nota ou email — ver temObservacoesEvento) e existe um
// onEdit disponível, é possível editá-las: a edição fica registada com autor e data/hora.
function TimelineEventModal({ evento, onClose, onEdit }) {
  const tipo = evento.tipo || "email";
  const meta = TIMELINE_TIPOS[tipo] || TIMELINE_TIPOS.email;
  const Icon = meta.icon;
  const titulo = tituloEventoTimeline(evento, tipo, meta);
  const dataFmt = new Date(evento.data).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const autor = evento.enviadoPor || evento.user || "—";
  const observavel = temObservacoesEvento(evento, tipo);
  const editavel = observavel && typeof onEdit === "function";

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [assuntoEdit, setAssuntoEdit] = useState(evento.assunto || "");
  const [textoEdit, setTextoEdit] = useState(evento.texto || "");
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const bodyRef = useRef(null);

  // ao entrar em modo de edição, repõe os campos com o conteúdo atual do acontecimento e
  // sincroniza o editor de texto rico (no caso dos emails)
  const iniciarEdicao = () => {
    setAssuntoEdit(evento.assunto || "");
    setTextoEdit(evento.texto || "");
    setEditando(true);
  };
  useEffect(() => {
    if (editando && tipo === "email" && bodyRef.current) {
      bodyRef.current.innerHTML = evento.corpo || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editando]);

  const format = (cmd) => {
    if (!bodyRef.current) return;
    bodyRef.current.focus();
    document.execCommand(cmd, false, null);
  };

  const guardarEdicao = async () => {
    setGuardando(true);
    try {
      const updates = tipo === "nota"
        ? { texto: textoEdit.trim() }
        : { assunto: assuntoEdit.trim(), corpo: bodyRef.current ? bodyRef.current.innerHTML : (evento.corpo || "") };
      await onEdit(evento.id, updates);
      setEditando(false);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "22px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: meta.bg, color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16, color: C.ink, lineHeight: 1.35 }}>{titulo}</div>
          <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Calendar size={11} />{dataFmt}</span>
            <span>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><UserCircle2 size={11} />{autor}</span>
          </div>
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>

      <div style={{ padding: "18px 24px 24px", maxHeight: "58vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, color: C.inkSoft, textTransform: "uppercase" }}>
            Observações
          </div>
          {editavel && !editando && (
            <button type="button" onClick={iniciarEdicao} style={{ ...iconBtn, display: "flex", alignItems: "center", gap: 5, width: "auto", padding: "5px 10px", fontSize: 12, fontWeight: 600, color: C.accent }}>
              <Pencil size={12} /> Editar
            </button>
          )}
        </div>

        {editando ? (
          <>
            {tipo === "email" ? (
              <>
                <Field label="Assunto do e-mail">
                  <input style={inputStyle} value={assuntoEdit} onChange={(e) => setAssuntoEdit(e.target.value)} />
                </Field>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.inkSoft, margin: "12px 0 5px" }}>Corpo do e-mail</label>
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 9, overflow: "hidden" }}>
                  <div style={{ display: "flex", gap: 2, padding: 6, background: "#FAFBFC", borderBottom: `1px solid ${C.line}` }}>
                    <button type="button" onClick={() => format("bold")} style={toolBtn} title="Negrito"><Bold size={14} /></button>
                    <button type="button" onClick={() => format("italic")} style={toolBtn} title="Itálico"><Italic size={14} /></button>
                    <button type="button" onClick={() => format("underline")} style={toolBtn} title="Sublinhado"><Underline size={14} /></button>
                    <button type="button" onClick={() => format("insertUnorderedList")} style={toolBtn} title="Lista"><List size={14} /></button>
                  </div>
                  <div
                    ref={bodyRef}
                    contentEditable
                    suppressContentEditableWarning
                    style={{ minHeight: 160, padding: "12px 14px", fontSize: 13.5, fontFamily: "Inter, sans-serif", color: C.ink, outline: "none", lineHeight: 1.6 }}
                  />
                </div>
              </>
            ) : (
              <textarea
                rows={6}
                autoFocus
                style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif", width: "100%", boxSizing: "border-box" }}
                value={textoEdit}
                onChange={(e) => setTextoEdit(e.target.value)}
              />
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <button type="button" onClick={() => setEditando(false)} style={btnGhost} disabled={guardando}>Cancelar</button>
              <button type="button" onClick={guardarEdicao} style={{ ...btnPrimary, opacity: guardando ? 0.6 : 1 }} disabled={guardando}>
                {guardando ? "A guardar…" : "Guardar edição"}
              </button>
            </div>
          </>
        ) : (
          <>
            {tipo === "email" ? (
              (evento.assunto || evento.corpo) ? (
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px" }}>
                  <TemplatePreviewContent assunto={evento.assunto} corpo={evento.corpo} />
                </div>
              ) : (
                <div style={{ color: C.inkSoft, fontSize: 13 }}>Sem conteúdo registado para este envio.</div>
              )
            ) : tipo === "nota" ? (
              <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px", fontSize: 13.5, color: C.ink, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {evento.texto || "Sem texto registado."}
              </div>
            ) : (
              <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px", color: C.inkSoft, fontSize: 13.5, lineHeight: 1.6 }}>
                {tipo === "followup_criado" || tipo === "followup_auto" ? (
                  <>Foi criada uma tarefa de follow-up da fase {evento.fase}{evento.templateNome ? `, com o template "${evento.templateNome}"` : ""}{tipo === "followup_auto" ? `, automaticamente, por não ter havido resposta em ${evento.dias} dia(s).` : "."}</>
                ) : tipo === "resposta" ? (
                  <>O contacto respondeu — o seguimento automático para este ciclo foi interrompido.</>
                ) : tipo === "primeiro_contacto" ? (
                  <>Foi registado o primeiro contacto com este destinatário, o que iniciou o fluxo de seguimento automático.</>
                ) : tipo === "estado" ? (
                  <>O estado do contacto foi alterado de "{evento.de}" para "{evento.para}".</>
                ) : tipo === "tarefa_concluida" ? (
                  <>A tarefa "{evento.tarefaTitulo}" foi marcada como concluída.</>
                ) : (
                  <>Sem observações adicionais registadas para este acontecimento.</>
                )}
              </div>
            )}

            {evento.editadoPor && (
              <div style={{ marginTop: 10, fontSize: 11.5, color: C.inkSoft, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Pencil size={11} />
                <span>Editado por <strong style={{ color: C.ink, fontWeight: 600 }}>{evento.editadoPor}</strong> em {new Date(evento.editadoEm).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                {evento.edicoes?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMostrarHistorico((v) => !v)}
                    style={{ background: "none", border: "none", padding: 0, color: C.accent, fontWeight: 600, fontSize: 11.5, cursor: "pointer" }}
                  >
                    {mostrarHistorico ? "ocultar histórico de edições" : `ver histórico de edições (${evento.edicoes.length})`}
                  </button>
                )}
              </div>
            )}

            {mostrarHistorico && evento.edicoes?.length > 0 && (
              <div style={{ marginTop: 10, borderLeft: `2px solid ${C.line}`, paddingLeft: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {evento.edicoes.slice().reverse().map((ed, i) => (
                  <div key={i} style={{ fontSize: 11.5, color: C.inkSoft }}>
                    Versão anterior — <strong style={{ color: C.ink, fontWeight: 600 }}>{ed.user || "—"}</strong>, {new Date(ed.data).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={onClose} style={btnGhost}>Fechar</button>
      </div>
    </Overlay>
  );
}

/* ---------- espaço add/edit modal ---------- */
function EspacoModal({ data, members, existingList, onClose, onSave, isNew, templates, user, onSendEmail, onResposta, onAddNota, onEditEvento, soLeitura }) {
  const [form, setForm] = useState({ ...data, historico: data.historico || [] });
  // Abre sempre nos dados: quem clica no lápis quer editar o contacto, não
  // consultar o histórico. A Timeline fica a um clique de distância.
  const [tab, setTab] = useState("dados"); // 'dados' | 'historico'
  const [avisoDuplicado, setAvisoDuplicado] = useState(null); // espaço já existente com o mesmo nome, a aguardar confirmação
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "nome" && avisoDuplicado) setAvisoDuplicado(null); // o nome mudou, a verificação de duplicado deixa de se aplicar
  };

  // muda o estado do contacto e regista de imediato o evento na Timeline — assim, ao alternar
  // para o separador Timeline (mesmo antes de guardar), a alteração já lá está refletida
  const setEstado = (novoEstado) => {
    setForm((f) => {
      if (f.estado === novoEstado) return f;
      const evento = { id: uid(), tipo: "estado", data: new Date().toISOString(), user, de: f.estado, para: novoEstado };
      return { ...f, estado: novoEstado, historico: [evento, ...(f.historico || [])] };
    });
  };

  // edita as observações de um acontecimento da timeline (nota/email) e atualiza de imediato a
  // ficha aberta, para o utilizador ver logo o resultado sem precisar de reabrir o modal
  const handleEditEvento = async (eventoId, updates) => {
    const updated = await onEditEvento?.(form.id, eventoId, updates);
    if (updated) setForm((f) => ({ ...f, historico: updated.historico }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    // ao criar (não ao editar), verifica se já existe um espaço com o mesmo nome, usando a mesma
    // lógica de normalização (sem maiúsculas/acentos) já usada na plataforma para evitar duplicados
    if (isNew) {
      const duplicado = encontrarDuplicadoPorNome(existingList, form.nome, form.id);
      if (duplicado) { setAvisoDuplicado(duplicado); return; }
    }
    onSave(form);
  };

  return (
    <Overlay onClose={onClose} xl={tab === "historico"} wide={tab !== "dados"}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
          {isNew ? "Adicionar Espaço" : form.nome || "Editar Espaço"}
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>

      {!isNew && (
        <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: `1px solid ${C.line}` }}>
          <button type="button" onClick={() => setTab("dados")} style={tabBtn(tab === "dados")}>Dados</button>
          <button type="button" onClick={() => setTab("historico")} style={tabBtn(tab === "historico")}>
            <Clock size={13} /> Timeline {form.historico?.length ? `(${form.historico.length})` : ""}
          </button>
        </div>
      )}

      {tab === "dados" ? (
        <form onSubmit={submit}>
          <fieldset disabled={soLeitura} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
          <div className="form-grid" style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "60vh", overflowY: "auto" }}>
            <Field label="Nome do espaço *" span2>
              <input required style={inputStyle} value={form.nome} onChange={(e) => set("nome", e.target.value)} />
            </Field>
            <Field label="Cidade">
              <input style={inputStyle} value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </Field>
            <Field label="Capacidade">
              <input style={inputStyle} value={form.capacidade} onChange={(e) => set("capacidade", e.target.value)} />
            </Field>
            <Field label="Pessoa de contacto">
              <input style={inputStyle} value={form.pessoaContacto} onChange={(e) => set("pessoaContacto", e.target.value)} />
            </Field>
            <Field label="Email">
              <input type="text" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Telefone">
              <input style={inputStyle} value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
            </Field>
            <Field label="Responsável pelo contacto">
              {isLider(user) ? (
                <select style={selectStyle} value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)}>
                  <option value="">Por atribuir</option>
                  {(members?.length ? members : EQUIPA).map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <div style={{ ...inputStyle, display: "flex", alignItems: "center", color: form.responsavel ? C.ink : C.gray, fontStyle: form.responsavel ? "normal" : "italic", background: C.grayBg }}>
                  {form.responsavel || "Por atribuir — apenas os líderes podem atribuir"}
                </div>
              )}
            </Field>
            <Field label="Estado do contacto">
              <select style={selectStyle} value={form.estado} onChange={(e) => setEstado(e.target.value)}>
                {ESTADOS.map((e) => <option key={e.v} value={e.v}>{e.v}</option>)}
              </select>
            </Field>
            <Field label="Fase">
              <select style={selectStyle} value={form.fase || ""} onChange={(e) => set("fase", e.target.value)}>
                <option value="">Sem fase</option>
                {FASES.map((f) => <option key={f.v} value={f.v}>{f.v}</option>)}
              </select>
            </Field>
            <Field label="Data do último contacto">
              <input type="date" style={inputStyle} value={form.dataUltimoContacto} onChange={(e) => set("dataUltimoContacto", e.target.value)} />
            </Field>
            <Field label="Data do próximo contacto">
              <input type="date" style={inputStyle} value={form.dataProximoContacto} onChange={(e) => set("dataProximoContacto", e.target.value)} />
            </Field>
            <Field label="Observações" span2>
              <textarea rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
            </Field>
          </div>
          </fieldset>
          {avisoDuplicado && (
            <div style={{ margin: "0 24px 16px", padding: "12px 14px", borderRadius: 10, background: C.amberBg, border: `1px solid ${C.amber}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AlertTriangle size={16} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>
                Já existe um espaço chamado <b>"{avisoDuplicado.nome}"</b> na lista. Tens a certeza que queres criar outro contacto com o mesmo nome?
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => setAvisoDuplicado(null)} style={{ ...btnGhost, padding: "6px 12px", fontSize: 12.5 }}>Rever nome</button>
                  <button type="button" onClick={() => onSave(form)} style={{ ...btnPrimary, padding: "6px 12px", fontSize: 12.5, background: C.amber }}>Criar mesmo assim</button>
                </div>
              </div>
            </div>
          )}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" onClick={onClose} style={btnGhost}>{soLeitura ? "Fechar" : "Cancelar"}</button>
            {!soLeitura && (
              <button type="submit" style={btnPrimary}>{isNew ? "Adicionar" : "Guardar alterações"}</button>
            )}
          </div>
        </form>
      ) : (
        <>
          <Timeline historico={form.historico} onEditEvento={handleEditEvento} />
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={btnGhost}>Fechar</button>
          </div>
        </>
      )}
    </Overlay>
  );
}

/* ---------- parceiros module ---------- */
function ParceirosModule({ partners, persistPartners, user, members, registerMember, showToast, templates, onResposta, onAddNota, onEditEvento, onConcluirTarefaContacto, soLeitura }) {
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("Todas");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterFase, setFilterFase] = useState("Todas");
  const [filterResp, setFilterResp] = useState("Todos");
  const [filterCard, setFilterCard] = useState(null); // null | 'contactados' | 'responderam' | 'naoResponderam'
  const [sortBy, setSortBy] = useState("nome");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete' | 'import'
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // ids selecionados para atribuição em massa
  const [bulkResp, setBulkResp] = useState("");

  const list = partners || [];

  // lista de responsáveis para o filtro: todos os membros da equipa já registados, mais quaisquer
  // nomes de responsável usados nos contactos que ainda não estejam nessa lista (garante que o filtro
  // está sempre completo, mesmo que um responsável ainda não tenha sido formalmente registado)
  const responsaveis = useMemo(() => {
    const s = new Set([...(members || []), ...list.map((a) => a.responsavel).filter(Boolean)]);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [list, members]);

  const filtered = useMemo(() => {
    return list.filter((a) => {
      if (filterCategoria !== "Todas" && a.categoria !== filterCategoria) return false;
      if (filterEstado !== "Todos" && a.estado !== filterEstado) return false;
      if (filterFase === "Sem fase" && a.fase) return false;
      if (filterFase !== "Todas" && filterFase !== "Sem fase" && a.fase !== filterFase) return false;
      if (filterResp !== "Todos" && a.responsavel !== filterResp) return false;
      if (filterCard === "contactados" && a.estado === ESTADO_NAO_CONTACTADO) return false;
      if (filterCard === "responderam" && !ESTADOS_RESPONDIDOS.includes(a.estado)) return false;
      if (filterCard === "naoResponderam" && a.estado !== ESTADO_AGUARDAR) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const blob = `${a.nome} ${a.contributo} ${a.pessoaContacto} ${a.email}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [list, search, filterCategoria, filterEstado, filterFase, filterResp, filterCard]);

  const sorted = useMemo(() => ordenarContactos(filtered, sortBy), [filtered, sortBy]);

  const stats = useMemo(() => {
    const by = (v) => list.filter((a) => a.estado === v).length;
    return {
      total: list.length,
      confirmado: by("Confirmado"),
      positivo: by("Positivo / Disponível"),
      aguardar: by("A aguardar resposta") + by("Por contactar") + by("Pediu mais informações"),
      recusado: by("Recusado"),
      contactados: list.filter((a) => a.estado !== ESTADO_NAO_CONTACTADO).length,
      responderam: list.filter((a) => ESTADOS_RESPONDIDOS.includes(a.estado)).length,
      naoResponderam: by(ESTADO_AGUARDAR),
      aAtrasados: list.filter(followUpAtrasado).length,
    };
  }, [list]);

  const toggleFilterCard = (key) => setFilterCard((f) => (f === key ? null : key));

  // Altera o estado a partir da lista, sem abrir a ficha. Faz exatamente o que
  // o separador "Dados" faz: regista o evento na timeline e, se o contacto
  // deixou de estar "Por contactar", conclui a tarefa de primeiro contacto.
  const alterarEstadoRapido = async (contacto, novoEstado) => {
    if (contacto.estado === novoEstado) return;
    const evento = { id: uid(), tipo: "estado", data: new Date().toISOString(), user, de: contacto.estado, para: novoEstado };
    const atualizado = {
      ...contacto,
      estado: novoEstado,
      historico: [evento, ...(contacto.historico || [])],
      atualizadoPor: user,
    };
    await persistPartners(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    if (novoEstado !== "Por contactar") await onConcluirTarefaContacto?.(contacto.id);
    showToast(`${contacto.nome}: estado alterado para "${novoEstado}".`);
  };

  // Altera a fase a partir da lista. A fase é uma etiqueta de organização da
  // equipa, por isso não gera evento na timeline nem mexe no seguimento.
  const alterarFaseRapido = async (contacto, novaFase) => {
    if ((contacto.fase || "") === novaFase) return;
    const atualizado = { ...contacto, fase: novaFase, atualizadoPor: user };
    await persistPartners(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    showToast(novaFase
      ? `${contacto.nome}: ${novaFase}.`
      : `${contacto.nome}: fase removida.`);
  };

  // Atribui o responsável a partir da lista. Reservado aos líderes, como na
  // ficha. Ao mudar o responsável, a tarefa automática de contacto acompanha
  // (é o syncContactTasks, chamado por persistPartners).
  const alterarResponsavelRapido = async (contacto, novoResponsavel) => {
    if ((contacto.responsavel || "") === novoResponsavel) return;
    const atualizado = { ...contacto, responsavel: novoResponsavel, atualizadoPor: user };
    if (novoResponsavel) registerMember(novoResponsavel);
    await persistPartners(list.map((x) => (x.id === contacto.id ? atualizado : x)));
    showToast(novoResponsavel
      ? `${contacto.nome} atribuído a ${novoResponsavel}.`
      : `${contacto.nome}: responsável removido.`);
  };

  // Altera as datas de contacto a partir da lista. São campos de planeamento,
  // por isso não geram evento na timeline nem mexem no seguimento automático —
  // esse continua a guiar-se pela data do último e-mail efetivamente enviado.
  const alterarDataRapido = async (contacto, campo, novaData) => {
    if ((contacto[campo] || "") === novaData) return;
    const atualizado = { ...contacto, [campo]: novaData, atualizadoPor: user };
    await persistPartners(list.map((x) => (x.id === contacto.id ? atualizado : x)));
  };

  const savePartner = async (data) => {
    // a mudança de estado já fica registada na timeline em tempo real, assim que é feita no
    // separador "Dados" do modal (ver setEstado em ParceiroModal) — aqui só persistimos o histórico
    // tal como o modal o entrega, sem voltar a acrescentar o evento
    const historico = data.historico || [];
    const withMeta = { ...data, historico, atualizadoPor: user, criadoPor: data.criadoPor || user };
    let next;
    if (modal === "add") next = [withMeta, ...list];
    else next = list.map((a) => (a.id === withMeta.id ? withMeta : a));
    if (withMeta.responsavel) registerMember(withMeta.responsavel);
    await persistPartners(next);
    if (withMeta.estado !== "Por contactar") await onConcluirTarefaContacto?.(withMeta.id);
    setModal(null);
    setEditing(null);
    showToast(modal === "add" ? `${withMeta.nome} adicionado.` : `${withMeta.nome} atualizado.`);
  };

  const confirmDelete = async () => {
    const next = list.filter((a) => a.id !== toDelete.id);
    await persistPartners(next);
    showToast(`${toDelete.nome} removido.`);
    setModal(null);
    setToDelete(null);
  };

  // regista automaticamente um envio de email na timeline e ativa o seguimento/follow-up automático
  const registerSend = async (contactId, entry) => {
    const next = list.map((a) => (a.id === contactId ? aplicarEnvioEmailContacto(a, entry) : a));
    await persistPartners(next);
    await onConcluirTarefaContacto?.(contactId);
    showToast(`E-mail registado — "${entry.templateNome}". Contacto passou para "A aguardar resposta".`);
  };

  // seleção em massa — alterna a seleção de um único parceiro, ou de todos os visíveis (filtrados/ordenados)
  const toggleSelect = (id) => setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const todosVisiveisSelecionados = sorted.length > 0 && sorted.every((a) => selectedIds.includes(a.id));
  const toggleSelectAll = () => {
    if (todosVisiveisSelecionados) setSelectedIds((ids) => ids.filter((id) => !sorted.some((a) => a.id === id)));
    else setSelectedIds((ids) => Array.from(new Set([...ids, ...sorted.map((a) => a.id)])));
  };

  // atribui, de uma só vez, o mesmo responsável a todos os parceiros selecionados
  const atribuirResponsavelEmMassa = async () => {
    if (!bulkResp || selectedIds.length === 0) return;
    const next = list.map((a) => (selectedIds.includes(a.id) ? { ...a, responsavel: bulkResp, atualizadoPor: user } : a));
    registerMember(bulkResp);
    await persistPartners(next);
    showToast(`${selectedIds.length} parceiro${selectedIds.length > 1 ? "s" : ""} atribuído${selectedIds.length > 1 ? "s" : ""} a ${bulkResp}.`);
    setSelectedIds([]);
    setBulkResp("");
  };

  // exporta a lista completa de parceiros (todos os campos já existentes na plataforma) para Excel
  const exportarParceiros = () => {
    const linhas = list.map((a, idx) => ({
      "Nº": idx + 1,
      "Nome": a.nome || "",
      "Categoria": a.categoria || "",
      "Contributo / apoio": a.contributo || "",
      "Pessoa de contacto": a.pessoaContacto || "",
      "Email": a.email || "",
      "Telefone": a.telefone || "",
      "Responsável": a.responsavel || "",
      "Estado": a.estado || "",
      "Fase": a.fase || "",
      "Último contacto": a.dataUltimoContacto || "",
      "Próximo contacto": a.dataProximoContacto || "",
      "Observações": a.observacoes || "",
    }));
    exportarListaExcel("Parceiros", "Parceiros", linhas);
    showToast("Lista de parceiros exportada para Excel.");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 24, color: C.ink }}>Gestão de Parceiros</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={exportarParceiros} style={btnGhost} title="Exportar a lista de parceiros para Excel">
            <Download size={15} /> Exportar Excel
          </button>
          {!soLeitura && (
            <button onClick={() => { setEditing(blankPartner()); setModal("add"); }} style={btnPrimary}>
              <Plus size={15} /> Adicionar Parceiro
            </button>
          )}
        </div>
      </div>

      <style>{STAT_CARD_CSS}</style>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard
          label="Total de contactos" value={stats.total} icon={Handshake} color={C.ink}
          active={filterCard === null} onClick={() => setFilterCard(null)}
          title="Mostrar todos os parceiros"
        />
        <StatCard
          label="Contactados" value={stats.contactados} icon={Send} color={C.teal}
          active={filterCard === "contactados"} onClick={() => toggleFilterCard("contactados")}
          title="Filtrar: parceiros já contactados"
        />
        <StatCard
          label="Responderam" value={stats.responderam} icon={Mails} color={C.green}
          active={filterCard === "responderam"} onClick={() => toggleFilterCard("responderam")}
          title="Filtrar: parceiros que já responderam"
        />
        <StatCard
          label="Não responderam" value={stats.naoResponderam} icon={Clock} color={C.amber}
          active={filterCard === "naoResponderam"} onClick={() => toggleFilterCard("naoResponderam")}
          title="Filtrar: parceiros a aguardar resposta"
        />
      </div>

      {stats.aAtrasados > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10,
          background: C.redBg, color: C.red, fontSize: 12.5, fontWeight: 600, marginBottom: 16,
        }}>
          <AlertTriangle size={14} />
          {stats.aAtrasados} parceiro{stats.aAtrasados > 1 ? "s" : ""} com seguimento em atraso — a próxima ação já devia ter acontecido.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={15} color={C.gray} style={{ position: "absolute", left: 12, top: 11 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, contributo, email…"
            style={{ ...inputStyle, paddingLeft: 34, width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)} style={selectStyle}>
          <option>Todas</option>
          {CATEGORIAS_PARCEIROS.map((c) => <option key={c.v}>{c.v}</option>)}
        </select>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={selectStyle}>
          <option>Todos</option>
          {ESTADOS.map((e) => <option key={e.v}>{e.v}</option>)}
        </select>
        <select value={filterFase} onChange={(e) => setFilterFase(e.target.value)} style={selectStyle} title="Filtrar por fase">
          <option value="Todas">Fase: Todas</option>
          {FASES.map((f) => <option key={f.v} value={f.v}>{f.v}</option>)}
          <option value="Sem fase">Sem fase</option>
        </select>
        <select value={filterResp} onChange={(e) => setFilterResp(e.target.value)} style={selectStyle} title="Filtrar por responsável">
          <option value="Todos">Responsável: Todos</option>
          {responsaveis.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle} title="Ordenar lista">
          {SORT_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
      </div>

      {selectedIds.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: C.grayBg, border: `1px solid ${C.line}`, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{selectedIds.length} parceiro{selectedIds.length > 1 ? "s" : ""} selecionado{selectedIds.length > 1 ? "s" : ""}</span>
          <select value={bulkResp} onChange={(e) => setBulkResp(e.target.value)} style={{ ...selectStyle, padding: "6px 10px", fontSize: 12.5, width: "auto" }}>
            <option value="">Atribuir a…</option>
            {(members?.length ? members : EQUIPA).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <button type="button" disabled={!bulkResp} onClick={atribuirResponsavelEmMassa} style={{ ...btnPrimary, padding: "7px 12px", fontSize: 12.5, opacity: bulkResp ? 1 : 0.5, cursor: bulkResp ? "pointer" : "not-allowed" }}>
            <Users size={13} /> Atribuir responsável
          </button>
          <button type="button" onClick={() => setSelectedIds([])} style={{ ...btnGhost, padding: "7px 12px", fontSize: 12.5 }}>Limpar seleção</button>
        </div>
      )}

      <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.line}`, overflow: "hidden" }}>
        {sorted.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: C.inkSoft }}>
            <Handshake size={28} color={C.gray} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Sem parceiros para mostrar</div>
            <div style={{ fontSize: 13.5 }}>Ainda não há parceiros concretos — adiciona o primeiro assim que houver contacto.</div>
          </div>
        ) : (
          <div className="tabela-scroll" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFBFC", borderBottom: `1px solid ${C.line}` }}>
                  <th style={{ padding: "11px 10px 11px 14px", width: 28 }}>
                    {!soLeitura && isLider(user) && (
                      <CheckboxToggle checked={todosVisiveisSelecionados} onChange={toggleSelectAll} title="Selecionar todos os parceiros visíveis" />
                    )}
                  </th>
                  {["Parceiro", "Categoria", "Contacto", "Contributo", "Responsável", "Estado", "Fase", "Último contacto", "Próximo contacto", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "11px 14px", color: C.inkSoft, fontWeight: 600, fontSize: 11.5, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => {
                  const info = estadoInfo(a.estado);
                  const EIcon = info.icon;
                  const cat = categoriaInfo(a.categoria);
                  const CIcon = cat.icon;
                  const atrasado = followUpAtrasado(a);
                  const hojeAcao = followUpHoje(a);
                  return (
                    <tr key={a.id} style={{ borderBottom: `1px solid ${C.line}`, background: atrasado ? C.redBg : undefined }}>
                      <td style={{ padding: "12px 10px 12px 14px", verticalAlign: "top" }}>
                        {!soLeitura && isLider(user) && (
                          <CheckboxToggle checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} title="Selecionar" />
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <div
                          onClick={() => { setEditing(a); setModal("edit"); }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setEditing(a); setModal("edit"); } }}
                          title="Abrir ficha"
                          className="nome-clicavel"
                          style={{ fontWeight: 600, color: C.ink, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                        >
                          {a.nome}
                          {atrasado && <AlertTriangle size={13} color={C.red} title="Seguimento em atraso" />}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 999, background: cat.bg, color: cat.color, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap" }}>
                          <CIcon size={11} /> {a.categoria}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft, maxWidth: 220 }}>
                        {a.pessoaContacto && <div style={{ color: C.ink, fontWeight: 500 }}>{a.pessoaContacto}</div>}
                        {a.email && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}><Mail size={11} />{a.email}</div>}
                        {a.telefone && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, marginTop: 2 }}><Phone size={11} />{a.telefone}</div>}
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: C.inkSoft, fontSize: 12.5, maxWidth: 220 }}>{a.contributo || "—"}</td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <ResponsavelSelect
                          contacto={a}
                          onChange={alterarResponsavelRapido}
                          equipa={members?.length ? members : EQUIPA}
                          podeEditar={!soLeitura && isLider(user)}
                        />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <EstadoSelect contacto={a} onChange={alterarEstadoRapido} disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <FaseSelect contacto={a} onChange={alterarFaseRapido} disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", fontSize: 12.5, whiteSpace: "nowrap" }}>
                        <DataSelect contacto={a} campo="dataUltimoContacto" valor={a.dataUltimoContacto} onChange={alterarDataRapido} etiqueta="Último contacto" disabled={soLeitura} />
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top", fontSize: 12.5, whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <DataSelect contacto={a} campo="dataProximoContacto" valor={a.dataProximoContacto} onChange={alterarDataRapido} etiqueta="Próximo contacto" disabled={soLeitura} />
                          {atrasado && (
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 7px", borderRadius: 999, background: C.redBg, color: C.red, fontSize: 10.5, fontWeight: 700 }}>Atrasado</span>
                          )}
                          {!atrasado && hojeAcao && (
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 7px", borderRadius: 999, background: C.amberBg, color: C.amber, fontSize: 10.5, fontWeight: 700 }}>Hoje</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button onClick={() => { setEditing(a); setModal("edit"); }} style={iconBtn} title={soLeitura ? "Ver ficha" : "Editar"}>
                            {soLeitura ? <Eye size={14} /> : <Pencil size={14} />}
                          </button>
                          {!soLeitura && (
                            <button onClick={() => { setToDelete(a); setModal("delete"); }} style={{ ...iconBtn, color: C.red }} title="Eliminar"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(modal === "add" || modal === "edit") && (
        <ParceiroModal
          data={editing}
          members={members}
          existingList={list}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={savePartner}
          isNew={modal === "add"}
          soLeitura={soLeitura}
          templates={templates}
          user={user}
          onSendEmail={registerSend}
          onResposta={onResposta}
          onAddNota={onAddNota}
          onEditEvento={onEditEvento}
        />
      )}

      {modal === "delete" && toDelete && (
        <ConfirmModal
          title="Eliminar parceiro"
          message={`Tens a certeza que queres eliminar "${toDelete.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Eliminar"
          danger
          onCancel={() => { setModal(null); setToDelete(null); }}
          onConfirm={confirmDelete}
        />
      )}

    </div>
  );
}

/* ---------- parceiro add/edit modal ---------- */
function ParceiroModal({ data, members, existingList, onClose, onSave, isNew, templates, user, onSendEmail, onResposta, onAddNota, onEditEvento, soLeitura }) {
  const [form, setForm] = useState({ ...data, historico: data.historico || [] });
  // Abre sempre nos dados: quem clica no lápis quer editar o contacto, não
  // consultar o histórico. A Timeline fica a um clique de distância.
  const [tab, setTab] = useState("dados"); // 'dados' | 'historico'
  const [avisoDuplicado, setAvisoDuplicado] = useState(null); // parceiro já existente com o mesmo nome, a aguardar confirmação
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "nome" && avisoDuplicado) setAvisoDuplicado(null); // o nome mudou, a verificação de duplicado deixa de se aplicar
  };

  // muda o estado do contacto e regista de imediato o evento na Timeline — assim, ao alternar
  // para o separador Timeline (mesmo antes de guardar), a alteração já lá está refletida
  const setEstado = (novoEstado) => {
    setForm((f) => {
      if (f.estado === novoEstado) return f;
      const evento = { id: uid(), tipo: "estado", data: new Date().toISOString(), user, de: f.estado, para: novoEstado };
      return { ...f, estado: novoEstado, historico: [evento, ...(f.historico || [])] };
    });
  };

  const handleEditEvento = async (eventoId, updates) => {
    const updated = await onEditEvento?.(form.id, eventoId, updates);
    if (updated) setForm((f) => ({ ...f, historico: updated.historico }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    // ao criar (não ao editar), verifica se já existe um parceiro com o mesmo nome, usando a mesma
    // lógica de normalização (sem maiúsculas/acentos) já usada na plataforma para evitar duplicados
    if (isNew) {
      const duplicado = encontrarDuplicadoPorNome(existingList, form.nome, form.id);
      if (duplicado) { setAvisoDuplicado(duplicado); return; }
    }
    onSave(form);
  };

  return (
    <Overlay onClose={onClose} xl={tab === "historico"} wide={tab !== "dados"}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
          {isNew ? "Adicionar Parceiro" : form.nome || "Editar Parceiro"}
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>

      {!isNew && (
        <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: `1px solid ${C.line}` }}>
          <button type="button" onClick={() => setTab("dados")} style={tabBtn(tab === "dados")}>Dados</button>
          <button type="button" onClick={() => setTab("historico")} style={tabBtn(tab === "historico")}>
            <Clock size={13} /> Timeline {form.historico?.length ? `(${form.historico.length})` : ""}
          </button>
        </div>
      )}

      {tab === "dados" ? (
        <form onSubmit={submit}>
          <fieldset disabled={soLeitura} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
          <div className="form-grid" style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "60vh", overflowY: "auto" }}>
            <Field label="Nome do parceiro *" span2>
              <input required style={inputStyle} value={form.nome} onChange={(e) => set("nome", e.target.value)} />
            </Field>
            <Field label="Categoria">
              <select style={selectStyle} value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                {CATEGORIAS_PARCEIROS.map((c) => <option key={c.v} value={c.v}>{c.v}</option>)}
              </select>
            </Field>
            <Field label="Contributo / apoio">
              <input style={inputStyle} placeholder="ex: transporte de equipamento" value={form.contributo} onChange={(e) => set("contributo", e.target.value)} />
            </Field>
            <Field label="Pessoa de contacto">
              <input style={inputStyle} value={form.pessoaContacto} onChange={(e) => set("pessoaContacto", e.target.value)} />
            </Field>
            <Field label="Email">
              <input type="text" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Telefone">
              <input style={inputStyle} value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
            </Field>
            <Field label="Responsável pelo contacto">
              {isLider(user) ? (
                <select style={selectStyle} value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)}>
                  <option value="">Por atribuir</option>
                  {(members?.length ? members : EQUIPA).map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <div style={{ ...inputStyle, display: "flex", alignItems: "center", color: form.responsavel ? C.ink : C.gray, fontStyle: form.responsavel ? "normal" : "italic", background: C.grayBg }}>
                  {form.responsavel || "Por atribuir — apenas os líderes podem atribuir"}
                </div>
              )}
            </Field>
            <Field label="Estado do contacto">
              <select style={selectStyle} value={form.estado} onChange={(e) => setEstado(e.target.value)}>
                {ESTADOS.map((e) => <option key={e.v} value={e.v}>{e.v}</option>)}
              </select>
            </Field>
            <Field label="Fase">
              <select style={selectStyle} value={form.fase || ""} onChange={(e) => set("fase", e.target.value)}>
                <option value="">Sem fase</option>
                {FASES.map((f) => <option key={f.v} value={f.v}>{f.v}</option>)}
              </select>
            </Field>
            <Field label="Data do último contacto">
              <input type="date" style={inputStyle} value={form.dataUltimoContacto} onChange={(e) => set("dataUltimoContacto", e.target.value)} />
            </Field>
            <Field label="Data do próximo contacto">
              <input type="date" style={inputStyle} value={form.dataProximoContacto} onChange={(e) => set("dataProximoContacto", e.target.value)} />
            </Field>
            <Field label="Observações" span2>
              <textarea rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
            </Field>
          </div>
          </fieldset>
          {avisoDuplicado && (
            <div style={{ margin: "0 24px 16px", padding: "12px 14px", borderRadius: 10, background: C.amberBg, border: `1px solid ${C.amber}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AlertTriangle size={16} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>
                Já existe um parceiro chamado <b>"{avisoDuplicado.nome}"</b> na lista. Tens a certeza que queres criar outro contacto com o mesmo nome?
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => setAvisoDuplicado(null)} style={{ ...btnGhost, padding: "6px 12px", fontSize: 12.5 }}>Rever nome</button>
                  <button type="button" onClick={() => onSave(form)} style={{ ...btnPrimary, padding: "6px 12px", fontSize: 12.5, background: C.amber }}>Criar mesmo assim</button>
                </div>
              </div>
            </div>
          )}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" onClick={onClose} style={btnGhost}>{soLeitura ? "Fechar" : "Cancelar"}</button>
            {!soLeitura && (
              <button type="submit" style={btnPrimary}>{isNew ? "Adicionar" : "Guardar alterações"}</button>
            )}
          </div>
        </form>
      ) : (
        <>
          <Timeline historico={form.historico} onEditEvento={handleEditEvento} />
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={btnGhost}>Fechar</button>
          </div>
        </>
      )}
    </Overlay>
  );
}

/* ---------- artist add/edit modal ---------- */
function ArtistModal({ data, members, existingList, onClose, onSave, isNew, templates, user, onSendEmail, onResposta, onAddNota, onEditEvento, soLeitura }) {
  const [form, setForm] = useState({ ...data, historico: data.historico || [] });
  // Abre sempre nos dados: quem clica no lápis quer editar o contacto, não
  // consultar o histórico. A Timeline fica a um clique de distância.
  const [tab, setTab] = useState("dados"); // 'dados' | 'historico'
  const [avisoDuplicado, setAvisoDuplicado] = useState(null); // artista já existente com o mesmo nome, a aguardar confirmação
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "nome" && avisoDuplicado) setAvisoDuplicado(null); // o nome mudou, a verificação de duplicado deixa de se aplicar
  };

  // muda o estado do contacto e regista de imediato o evento na Timeline — assim, ao alternar
  // para o separador Timeline (mesmo antes de guardar), a alteração já lá está refletida
  const setEstado = (novoEstado) => {
    setForm((f) => {
      if (f.estado === novoEstado) return f;
      const evento = { id: uid(), tipo: "estado", data: new Date().toISOString(), user, de: f.estado, para: novoEstado };
      return { ...f, estado: novoEstado, historico: [evento, ...(f.historico || [])] };
    });
  };

  const handleEditEvento = async (eventoId, updates) => {
    const updated = await onEditEvento?.(form.id, eventoId, updates);
    if (updated) setForm((f) => ({ ...f, historico: updated.historico }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    // ao criar (não ao editar), verifica se já existe um artista com o mesmo nome, usando a mesma
    // lógica de normalização (sem maiúsculas/acentos) já usada na plataforma para evitar duplicados
    if (isNew) {
      const duplicado = encontrarDuplicadoPorNome(existingList, form.nome, form.id);
      if (duplicado) { setAvisoDuplicado(duplicado); return; }
    }
    onSave(form);
  };

  return (
    <Overlay onClose={onClose} xl={tab === "historico"} wide={tab !== "dados"}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
          {isNew ? "Adicionar Artista" : form.nome || "Editar Artista"}
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>

      {!isNew && (
        <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: `1px solid ${C.line}` }}>
          <button type="button" onClick={() => setTab("dados")} style={tabBtn(tab === "dados")}>Dados</button>
          <button type="button" onClick={() => setTab("historico")} style={tabBtn(tab === "historico")}>
            <Clock size={13} /> Timeline {form.historico?.length ? `(${form.historico.length})` : ""}
          </button>
        </div>
      )}


      {tab === "dados" ? (
        <form onSubmit={submit}>
          <fieldset disabled={soLeitura} style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}>
          <div className="form-grid" style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "60vh", overflowY: "auto" }}>
            <Field label="Nome do artista *" span2>
              <input required style={inputStyle} value={form.nome} onChange={(e) => set("nome", e.target.value)} />
            </Field>
            <Field label="Agência">
              <input style={inputStyle} value={form.agencia} onChange={(e) => set("agencia", e.target.value)} />
            </Field>
            <Field label="Pessoa de contacto">
              <input style={inputStyle} value={form.pessoaContacto} onChange={(e) => set("pessoaContacto", e.target.value)} />
            </Field>
            <Field label="Email">
              <input type="text" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Telefone">
              <input style={inputStyle} value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
            </Field>
            <Field label="Responsável pelo contacto">
              {isLider(user) ? (
                <select style={selectStyle} value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)}>
                  <option value="">Por atribuir</option>
                  {(members?.length ? members : EQUIPA).map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <div style={{ ...inputStyle, display: "flex", alignItems: "center", color: form.responsavel ? C.ink : C.gray, fontStyle: form.responsavel ? "normal" : "italic", background: C.grayBg }}>
                  {form.responsavel || "Por atribuir — apenas os líderes podem atribuir"}
                </div>
              )}
            </Field>
            <Field label="Estado do contacto">
              <select style={selectStyle} value={form.estado} onChange={(e) => setEstado(e.target.value)}>
                {ESTADOS.map((e) => <option key={e.v} value={e.v}>{e.v}</option>)}
              </select>
            </Field>
            <Field label="Fase">
              <select style={selectStyle} value={form.fase || ""} onChange={(e) => set("fase", e.target.value)}>
                <option value="">Sem fase</option>
                {FASES.map((f) => <option key={f.v} value={f.v}>{f.v}</option>)}
              </select>
            </Field>
            <Field label="Data do último contacto">
              <input type="date" style={inputStyle} value={form.dataUltimoContacto} onChange={(e) => set("dataUltimoContacto", e.target.value)} />
            </Field>
            <Field label="Data do próximo contacto">
              <input type="date" style={inputStyle} value={form.dataProximoContacto} onChange={(e) => set("dataProximoContacto", e.target.value)} />
            </Field>
            <Field label="Observações" span2>
              <textarea rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
            </Field>
          </div>
          </fieldset>
          {avisoDuplicado && (
            <div style={{ margin: "0 24px 16px", padding: "12px 14px", borderRadius: 10, background: C.amberBg, border: `1px solid ${C.amber}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AlertTriangle size={16} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>
                Já existe um artista chamado <b>"{avisoDuplicado.nome}"</b> na lista. Tens a certeza que queres criar outro contacto com o mesmo nome?
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => setAvisoDuplicado(null)} style={{ ...btnGhost, padding: "6px 12px", fontSize: 12.5 }}>Rever nome</button>
                  <button type="button" onClick={() => onSave(form)} style={{ ...btnPrimary, padding: "6px 12px", fontSize: 12.5, background: C.amber }}>Criar mesmo assim</button>
                </div>
              </div>
            </div>
          )}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" onClick={onClose} style={btnGhost}>{soLeitura ? "Fechar" : "Cancelar"}</button>
            {!soLeitura && (
              <button type="submit" style={btnPrimary}>{isNew ? "Adicionar" : "Guardar alterações"}</button>
            )}
          </div>
        </form>
      ) : (
        <>
          <Timeline historico={form.historico} onEditEvento={handleEditEvento} />
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={btnGhost}>Fechar</button>
          </div>
        </>
      )}
    </Overlay>
  );
}

/* ---------- templates de email module ---------- */
function TemplatesModule({ templates, persistTemplates, user, showToast, soLeitura }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toPreview, setToPreview] = useState(null);

  const list = templates || [];

  const searchQ = search.trim().toLowerCase();
  const matches = (t) => !searchQ || `${t.nome} ${t.assunto}`.toLowerCase().includes(searchQ);

  // agrupa por categoria e ordena cada grupo pela fase (o "fluxo" de contacto), com o nome como desempate
  const porCategoria = useMemo(() => {
    const map = {};
    CATEGORIAS_TEMPLATES.forEach((c) => { map[c.v] = []; });
    list.forEach((t) => {
      if (!map[t.categoria]) map[t.categoria] = [];
      map[t.categoria].push(t);
    });
    Object.keys(map).forEach((k) => {
      map[k] = map[k].slice().sort((a, b) => (a.fase || 0) - (b.fase || 0) || a.nome.localeCompare(b.nome));
    });
    return map;
  }, [list]);

  const proximaFase = (categoria) => {
    const existentes = porCategoria[categoria] || [];
    if (existentes.length === 0) return 1;
    return Math.max(...existentes.map((t) => t.fase || 0)) + 1;
  };

  const saveTemplate = async (data) => {
    const agora = new Date().toISOString();
    const withMeta = {
      ...data,
      atualizadoPor: user,
      atualizadoEm: agora,
      criadoPor: data.criadoPor || user,
      criadoEm: data.criadoEm || agora,
    };
    let next;
    if (modal === "add") next = [withMeta, ...list];
    else next = list.map((t) => (t.id === withMeta.id ? withMeta : t));
    await persistTemplates(next);
    setModal(null);
    setEditing(null);
    showToast(modal === "add" ? `Template "${withMeta.nome}" criado.` : `Template "${withMeta.nome}" atualizado.`);
  };

  const duplicateTemplate = async (t) => {
    const agora = new Date().toISOString();
    const copy = {
      ...t, id: uid(), nome: `${t.nome} (cópia)`,
      criadoPor: user, atualizadoPor: user, criadoEm: agora, atualizadoEm: agora,
    };
    await persistTemplates([copy, ...list]);
    showToast(`Template "${t.nome}" duplicado.`);
  };

  const confirmDelete = async () => {
    const next = list.filter((t) => t.id !== toDelete.id);
    await persistTemplates(next);
    showToast(`Template "${toDelete.nome}" eliminado.`);
    setModal(null);
    setToDelete(null);
  };

  return (
    <div>
      <style>{BOARD_CSS}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 24, color: C.ink }}>Templates de E-mail</div>
        </div>
        <div style={{ position: "relative", minWidth: 240 }}>
          <Search size={15} color={C.gray} style={{ position: "absolute", left: 12, top: 11 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome ou assunto…"
            style={{ ...inputStyle, paddingLeft: 34, width: "100%", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 10 }}>
        {CATEGORIAS_TEMPLATES.map((cat) => {
          const CIcon = cat.icon;
          const totalCat = (porCategoria[cat.v] || []).length;
          const templatesCat = (porCategoria[cat.v] || []).filter(matches);
          return (
            <div key={cat.v} style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: cat.bg, marginBottom: 12 }}>
                <CIcon size={15} color={cat.color} />
                <div style={{ fontWeight: 700, fontSize: 12.5, color: cat.color, flex: 1, lineHeight: 1.25 }}>{cat.v}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: cat.color, background: "rgba(255,255,255,0.55)", padding: "2px 7px", borderRadius: 999, flexShrink: 0 }}>{totalCat}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {templatesCat.length === 0 ? (
                  <div style={{ padding: "16px 12px", textAlign: "center", color: C.gray, fontSize: 12, border: `1px dashed ${C.line}`, borderRadius: 10 }}>
                    {totalCat === 0 ? "Ainda sem templates" : "Sem resultados"}
                  </div>
                ) : (
                  templatesCat.map((t) => (
                    <div
                      key={t.id}
                      className="tmpl-card"
                      onClick={() => setToPreview(t)}
                      style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 13px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 999, background: cat.bg, color: cat.color, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          {t.fase || "·"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 3 }}>{t.nome}</div>
                          <div style={{ fontSize: 12, color: C.inkSoft, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {t.assunto || "—"}
                          </div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, color: C.gray, marginTop: 4 }}>
                            <Clock size={10} /> Follow-up automático ao fim de {t.intervaloDias || DEFAULT_FOLLOWUP_DIAS} dias sem resposta
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 8, borderTop: `1px solid ${C.line}`, paddingTop: 6 }}>
                        <button onClick={(e) => { e.stopPropagation(); setToPreview(t); }} style={iconBtn} title="Pré-visualizar"><Eye size={13} /></button>
                        {!soLeitura && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); duplicateTemplate(t); }} style={iconBtn} title="Duplicar"><Copy size={13} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setEditing(t); setModal("edit"); }} style={iconBtn} title="Editar"><Pencil size={13} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setToDelete(t); setModal("delete"); }} style={{ ...iconBtn, color: C.red }} title="Eliminar"><Trash2 size={13} /></button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {!soLeitura && (
                <button
                  className="tmpl-add-btn"
                  onClick={() => { setEditing({ ...blankTemplate(), categoria: cat.v, fase: proximaFase(cat.v) }); setModal("add"); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 10px", borderRadius: 10, border: `1px dashed ${C.line}`, background: "transparent", color: C.inkSoft, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                >
                  <Plus size={13} /> Adicionar fase
                </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(modal === "add" || modal === "edit") && (
        <TemplateModal
          data={editing}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={saveTemplate}
          isNew={modal === "add"}
        />
      )}

      {modal === "delete" && toDelete && (
        <ConfirmModal
          title="Eliminar template"
          message={`Tens a certeza que queres eliminar o template "${toDelete.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Eliminar"
          danger
          onCancel={() => { setModal(null); setToDelete(null); }}
          onConfirm={confirmDelete}
        />
      )}

      {toPreview && (
        <TemplatePreviewModal template={toPreview} onClose={() => setToPreview(null)} />
      )}
    </div>
  );
}

/* ---------- template add/edit modal (com editor de texto e variáveis dinâmicas) ---------- */
function TemplateModal({ data, onClose, onSave, isNew }) {
  const [form, setForm] = useState(data);
  const [tab, setTab] = useState("editar"); // 'editar' | 'preview'
  const bodyRef = useRef(null);
  const subjectRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // sincroniza o conteúdo do editor sempre que a tab "editar" volta a montar
  useEffect(() => {
    if (tab === "editar" && bodyRef.current) {
      bodyRef.current.innerHTML = form.corpo || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const insertVarSubject = (key) => {
    const el = subjectRef.current;
    const atual = form.assunto || "";
    const start = el ? (el.selectionStart ?? atual.length) : atual.length;
    const end = el ? (el.selectionEnd ?? atual.length) : atual.length;
    const next = `${atual.slice(0, start)}{{${key}}}${atual.slice(end)}`;
    set("assunto", next);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + key.length + 4;
      el.setSelectionRange(pos, pos);
    });
  };

  const insertVarBody = (key) => {
    const el = bodyRef.current;
    if (!el) return;
    el.focus();
    document.execCommand("insertText", false, `{{${key}}}`);
    set("corpo", el.innerHTML);
  };

  const format = (cmd) => {
    if (!bodyRef.current) return;
    bodyRef.current.focus();
    document.execCommand(cmd, false, null);
    set("corpo", bodyRef.current.innerHTML);
  };

  const submit = (e) => {
    e.preventDefault();
    const corpoFinal = bodyRef.current ? bodyRef.current.innerHTML : form.corpo;
    if (!form.nome.trim() || !form.assunto.trim()) return;
    onSave({ ...form, corpo: corpoFinal });
  };

  const preview = useMemo(() => aplicarVariaveis(form.assunto, form.corpo), [form.assunto, form.corpo]);

  return (
    <Overlay onClose={onClose} wide>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
          {isNew ? "Novo Template de E-mail" : "Editar Template de E-mail"}
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: `1px solid ${C.line}` }}>
        <button type="button" onClick={() => setTab("editar")} style={tabBtn(tab === "editar")}>Editar</button>
        <button type="button" onClick={() => setTab("preview")} style={tabBtn(tab === "preview")}>
          <Eye size={13} /> Pré-visualização
        </button>
      </div>

      <form onSubmit={submit}>
        {tab === "editar" ? (
          <div style={{ padding: "18px 24px", maxHeight: "58vh", overflowY: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.6fr 0.9fr", gap: 14, marginBottom: 14 }}>
              <Field label="Nome do template *">
                <input required style={inputStyle} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="ex: 1ª fase — Convite inicial" />
              </Field>
              <Field label="Categoria">
                <select style={selectStyle} value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                  {CATEGORIAS_TEMPLATES.map((c) => <option key={c.v} value={c.v}>{c.v}</option>)}
                </select>
              </Field>
              <Field label="Fase">
                <input type="number" min={1} style={inputStyle} value={form.fase} onChange={(e) => set("fase", Number(e.target.value) || 1)} />
              </Field>
              <Field label="Intervalo (dias)">
                <input
                  type="number" min={1} style={inputStyle}
                  value={form.intervaloDias ?? DEFAULT_FOLLOWUP_DIAS}
                  onChange={(e) => set("intervaloDias", Number(e.target.value) || DEFAULT_FOLLOWUP_DIAS)}
                  title="Dias sem resposta a aguardar, depois de enviado este template, antes de a plataforma criar automaticamente o follow-up da fase seguinte"
                />
              </Field>
            </div>

            <Field label="Assunto do e-mail *">
              <input ref={subjectRef} required style={inputStyle} value={form.assunto} onChange={(e) => set("assunto", e.target.value)} placeholder="ex: Convite para o Concerto Solidário · IPO" />
            </Field>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0 16px" }}>
              {VARIAVEIS_TEMPLATE.map((v) => (
                <button key={v.key} type="button" onClick={() => insertVarSubject(v.key)} style={varChip} title={`Inserir no assunto: ${v.label}`}>
                  <Braces size={11} /> {`{{${v.key}}}`}
                </button>
              ))}
            </div>

            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>Corpo do e-mail *</label>
            <div style={{ border: `1px solid ${C.line}`, borderRadius: 9, overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 2, padding: 6, background: "#FAFBFC", borderBottom: `1px solid ${C.line}` }}>
                <button type="button" onClick={() => format("bold")} style={toolBtn} title="Negrito"><Bold size={14} /></button>
                <button type="button" onClick={() => format("italic")} style={toolBtn} title="Itálico"><Italic size={14} /></button>
                <button type="button" onClick={() => format("underline")} style={toolBtn} title="Sublinhado"><Underline size={14} /></button>
                <button type="button" onClick={() => format("insertUnorderedList")} style={toolBtn} title="Lista"><List size={14} /></button>
              </div>
              <div
                ref={bodyRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => set("corpo", e.currentTarget.innerHTML)}
                style={{ minHeight: 180, padding: "12px 14px", fontSize: 13.5, fontFamily: "Inter, sans-serif", color: C.ink, outline: "none", lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {VARIAVEIS_TEMPLATE.map((v) => (
                <button key={v.key} type="button" onClick={() => insertVarBody(v.key)} style={varChip} title={`Inserir no corpo: ${v.label}`}>
                  <Braces size={11} /> {`{{${v.key}}}`}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: C.inkSoft, lineHeight: 1.5 }}>
              Usa estas variáveis no assunto ou no corpo do e-mail — serão substituídas automaticamente pelos dados reais quando o template for utilizado.
            </div>
          </div>
        ) : (
          <div style={{ padding: "18px 24px", maxHeight: "58vh", overflowY: "auto" }}>
            <TemplatePreviewContent assunto={preview.assunto} corpo={preview.corpo} />
          </div>
        )}

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Cancelar</button>
          <button type="submit" style={btnPrimary}>{isNew ? "Criar template" : "Guardar alterações"}</button>
        </div>
      </form>
    </Overlay>
  );
}

// Limpa o HTML dos templates antes de o mostrar.
//
// O corpo é escrito no editor da plataforma e guardado como HTML. Com os dados
// partilhados, um template escrito por uma pessoa passa a ser renderizado no
// browser de toda a equipa — e como o acesso não tem palavra-passe, basta
// alguém com o endereço do site guardar um <script> num template para o código
// correr no computador de quem o abrir.
//
// Mantêm-se as etiquetas que o editor produz (negrito, itálico, sublinhado,
// listas, parágrafos e quebras de linha) e descarta-se tudo o resto.
const ETIQUETAS_PERMITIDAS = new Set([
  "B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "P", "BR", "DIV", "SPAN",
]);

const limparHtml = (html) => {
  if (typeof document === "undefined") return "";
  const raiz = document.createElement("div");
  raiz.innerHTML = html || "";
  raiz.querySelectorAll("*").forEach((el) => {
    if (!ETIQUETAS_PERMITIDAS.has(el.tagName)) {
      // Preserva o texto de dentro, para não perder conteúdo legítimo.
      el.replaceWith(...el.childNodes);
      return;
    }
    // Atributos podem carregar código (onclick, href="javascript:", …).
    [...el.attributes].forEach((attr) => {
      if (attr.name.toLowerCase() !== "style") el.removeAttribute(attr.name);
    });
  });
  return raiz.innerHTML;
};

/* ---------- conteúdo de pré-visualização (partilhado entre o modal de edição e o modal standalone) ---------- */
function TemplatePreviewContent({ assunto, corpo }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, letterSpacing: 0.3, marginBottom: 4 }}>ASSUNTO</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, fontFamily: "Space Grotesk, sans-serif", marginBottom: 18 }}>
        {assunto || <span style={{ color: C.gray, fontStyle: "italic", fontWeight: 500 }}>(sem assunto)</span>}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, letterSpacing: 0.3, marginBottom: 8 }}>CORPO DO E-MAIL</div>
      <div
        style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "18px 20px", fontSize: 13.5, color: C.ink, lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{
          __html: corpo
            ? limparHtml(corpo)
            : "<span style='color:#8A93A1;font-style:italic'>(sem conteúdo)</span>",
        }}
      />
    </div>
  );
}

/* ---------- modal de pré-visualização standalone (acedido a partir da listagem) ---------- */
function TemplatePreviewModal({ template, onClose }) {
  const { assunto, corpo } = useMemo(() => aplicarVariaveis(template.assunto, template.corpo), [template]);
  const info = categoriaTemplateInfo(template.categoria);
  const CIcon = info.icon;
  return (
    <Overlay onClose={onClose} wide>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink, marginBottom: 6 }}>{template.nome}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 999, background: info.bg, color: info.color, fontSize: 11, fontWeight: 600 }}>
              <CIcon size={11} /> {template.categoria}
            </span>
            {template.fase ? (
              <span style={{ fontSize: 11, fontWeight: 600, color: C.inkSoft }}>Fase {template.fase}</span>
            ) : null}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: C.inkSoft }}>
              <Clock size={11} /> Follow-up ao fim de {template.intervaloDias || DEFAULT_FOLLOWUP_DIAS} dias
            </span>
          </div>
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>
      <div style={{ padding: "20px 24px", maxHeight: "58vh", overflowY: "auto" }}>
        <TemplatePreviewContent assunto={assunto} corpo={corpo} />
      </div>
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnGhost}>Fechar</button>
      </div>
    </Overlay>
  );
}

/* ---------- tarefas module ---------- */
function TarefasModule({
  tasks, persistTasks, user, showToast, onToggleTask, onSetTaskEstado,
  templates, listByTipo, onResposta, members, remetente, soLeitura, dadosEquipa,
}) {
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverEstado, setDragOverEstado] = useState(null);
  const [filterResp, setFilterResp] = useState("Todos");
  const [filterPrioridade, setFilterPrioridade] = useState("Todas");
  const [detalheTask, setDetalheTask] = useState(null); // tarefa automática aberta em detalhe

  const allTasks = tasks || [];

  const responsaveis = useMemo(() => {
    const s = new Set([...(members || []), ...allTasks.map((t) => t.responsavel).filter(Boolean)]);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [allTasks, members]);

  // filtros de responsável e prioridade são combináveis (aplicados em conjunto)
  const list = useMemo(() => {
    return allTasks.filter((t) => {
      if (filterResp !== "Todos" && t.responsavel !== filterResp) return false;
      if (filterPrioridade !== "Todas" && (t.prioridade || "Média") !== filterPrioridade) return false;
      return true;
    });
  }, [allTasks, filterResp, filterPrioridade]);

  const saveTask = async (data) => {
    const withMeta = {
      ...data, atualizadoPor: user, criadoPor: data.criadoPor || user,
      criadoEm: data.criadoEm || new Date().toISOString(),
    };
    let next;
    if (modal === "add") next = [withMeta, ...allTasks];
    else next = allTasks.map((t) => (t.id === withMeta.id ? withMeta : t));
    await persistTasks(next);
    setModal(null);
    setEditing(null);
    showToast(modal === "add" ? `Tarefa "${withMeta.titulo}" adicionada.` : `Tarefa "${withMeta.titulo}" atualizada.`);
  };

  const confirmDelete = async () => {
    const next = allTasks.filter((t) => t.id !== toDelete.id);
    await persistTasks(next);
    showToast(`Tarefa "${toDelete.titulo}" removida.`);
    setModal(null);
    setToDelete(null);
  };

  // solta o cartão que estava a ser arrastado na coluna de destino, mudando o estado da tarefa
  const largarNaColuna = async (estadoColuna) => {
    setDragOverEstado(null);
    const tarefa = allTasks.find((t) => t.id === draggingId);
    setDraggingId(null);
    if (!tarefa || tarefa.estado === estadoColuna) return;
    await onSetTaskEstado(tarefa, estadoColuna);
  };

  const iniciais = (nome) => (nome || "").trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 24, color: C.ink }}>Tarefas</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!soLeitura && isLider(user) && (
            <button onClick={() => { setEditing(blankTask()); setModal("add"); }} style={btnPrimary}>
              <Plus size={15} /> Nova Tarefa
            </button>
          )}
        </div>
      </div>
      {!isLider(user) && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "7px 12px", borderRadius: 999, background: C.grayBg, color: C.inkSoft, fontSize: 12, fontWeight: 500 }}>
          <UserCircle2 size={13} /> Podes gerir apenas as tarefas atribuídas a ti. Criar, editar ou reatribuir tarefas é uma função exclusiva dos líderes de equipa.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={filterResp} onChange={(e) => setFilterResp(e.target.value)} style={selectStyle} title="Filtrar por responsável">
          <option value="Todos">Responsável: Todos</option>
          {responsaveis.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={filterPrioridade} onChange={(e) => setFilterPrioridade(e.target.value)} style={selectStyle}>
          <option>Todas</option>
          {PRIORIDADES_TAREFA.map((p) => <option key={p.v}>{p.v}</option>)}
        </select>
      </div>

      {allTasks.length === 0 ? (
        <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.line}`, padding: "50px 20px", textAlign: "center", color: C.inkSoft }}>
          <ListChecks size={28} color={C.gray} style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Sem tarefas para mostrar</div>
          <div style={{ fontSize: 13.5 }}>Adiciona a primeira tarefa, ou define um responsável num artista, espaço ou parceiro.</div>
        </div>
      ) : list.length === 0 ? (
        <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.line}`, padding: "50px 20px", textAlign: "center", color: C.inkSoft }}>
          <ListChecks size={28} color={C.gray} style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Sem tarefas para os filtros selecionados</div>
          <div style={{ fontSize: 13.5 }}>Experimenta ajustar o filtro de responsável ou de prioridade.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${ESTADOS_TAREFA.length}, minmax(0, 1fr))`, gap: 16, alignItems: "start" }}>
          {ESTADOS_TAREFA.map((coluna) => {
            const tarefasColuna = list.filter((t) => t.estado === coluna.v);
            const ColIcon = coluna.icon;
            const aReceberDrag = dragOverEstado === coluna.v;
            return (
              <div
                key={coluna.v}
                onDragOver={(e) => { e.preventDefault(); setDragOverEstado(coluna.v); }}
                onDragLeave={() => setDragOverEstado((s) => (s === coluna.v ? null : s))}
                onDrop={(e) => { e.preventDefault(); largarNaColuna(coluna.v); }}
                style={{
                  background: aReceberDrag ? coluna.bg : "#FAFBFC",
                  border: `1.5px dashed ${aReceberDrag ? coluna.color : C.line}`,
                  borderRadius: 14,
                  padding: 12,
                  minHeight: 160,
                  transition: "background .15s ease, border-color .15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "0 4px" }}>
                  <ColIcon size={14} color={coluna.color} />
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>{coluna.v}</div>
                  <span style={{ fontSize: 11, color: C.gray, marginLeft: "auto" }}>{tarefasColuna.length}</span>
                </div>

                {tarefasColuna.length === 0 ? (
                  <div style={{ padding: "18px 8px", textAlign: "center", color: C.gray, fontSize: 12 }}>Sem tarefas aqui.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {tarefasColuna.map((t) => {
                      const auto = !!t.origem;
                      // apenas os líderes, ou o próprio responsável pela tarefa, podem mover o cartão
                      // entre colunas (concluir o seu próprio trabalho); os restantes tarefas ficam
                      // visíveis mas não são arrastáveis por quem não é dono nem líder
                      const podeGerir = !soLeitura && (isLider(user) || t.responsavel === user);
                      return (
                        <div
                          key={t.id}
                          draggable={podeGerir}
                          onDragStart={() => { if (podeGerir) setDraggingId(t.id); }}
                          onDragEnd={() => { setDraggingId(null); setDragOverEstado(null); }}
                          onClick={() => { if (auto && podeGerir) setDetalheTask(t); }}
                          style={{
                            background: C.panel,
                            border: `1px solid ${C.line}`,
                            borderRadius: 10,
                            padding: "10px 12px",
                            cursor: podeGerir ? (auto ? "pointer" : "grab") : "default",
                            opacity: draggingId === t.id ? 0.5 : 1,
                            boxShadow: "0 1px 2px rgba(19,26,44,0.04)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                            <div style={{ fontWeight: 600, fontSize: 12.5, color: C.ink, lineHeight: 1.35 }}>{t.titulo}</div>
                            {!auto && !soLeitura && isLider(user) && (
                              <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                                <button onClick={() => { setEditing(t); setModal("edit"); }} style={{ ...iconBtn, width: 22, height: 22 }} title="Editar"><Pencil size={12} /></button>
                                <button onClick={() => { setToDelete(t); setModal("delete"); }} style={{ ...iconBtn, width: 22, height: 22, color: C.red }} title="Eliminar"><Trash2 size={12} /></button>
                              </div>
                            )}
                          </div>

                          {(auto || t.prioridade) && (
                            <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 5 }}>
                              {auto && (
                                <span style={{ fontSize: 10.5, color: C.inkSoft, fontWeight: 600, padding: "2px 7px", borderRadius: 999, background: "#F1F3F5" }}>
                                  {t.origem.evento === "followup" ? `Follow-up (Fase ${t.origem.fase})` : (TASK_TIPOS[t.origem.tipo]?.label || "Contacto")}
                                </span>
                              )}
                              {t.prioridade && (
                                <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 7px", borderRadius: 999, color: prioridadeTarefaInfo(t.prioridade).color, background: prioridadeTarefaInfo(t.prioridade).bg }}>
                                  {t.prioridade}
                                </span>
                              )}
                            </div>
                          )}

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 9, gap: 6 }}>
                            {t.responsavel ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                                <div style={{ width: 18, height: 18, borderRadius: 999, background: C.accentSoft, color: C.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  {iniciais(t.responsavel)}
                                </div>
                                <span style={{ fontSize: 11.5, color: C.ink, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.responsavel}</span>
                              </div>
                            ) : (
                              <span style={{ fontSize: 11, color: C.gray, fontStyle: "italic" }}>por atribuir</span>
                            )}
                            {t.dataLimite && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, color: C.inkSoft, flexShrink: 0 }}><Calendar size={10} />{t.dataLimite}</span>
                            )}
                          </div>
                          {auto && (
                            <div style={{ marginTop: 7, paddingTop: 7, borderTop: `1px dashed ${C.line}`, display: "flex", alignItems: "center", gap: 4, color: C.accent, fontSize: 10.5, fontWeight: 600 }}>
                              <Mails size={11} /> Ver template e registar resposta <ChevronRight size={11} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(modal === "add" || modal === "edit") && (
        <TaskModal
          data={editing}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={saveTask}
          isNew={modal === "add"}
          members={members}
        />
      )}

      {modal === "delete" && toDelete && (
        <ConfirmModal
          title="Eliminar tarefa"
          message={`Tens a certeza que queres eliminar "${toDelete.titulo}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Eliminar"
          danger
          onCancel={() => { setModal(null); setToDelete(null); }}
          onConfirm={confirmDelete}
        />
      )}

      {detalheTask && (
        <AutoTaskModal
          task={detalheTask}
          templates={templates}
          contact={(listByTipo?.[detalheTask.origem.tipo] || []).find((c) => c.id === detalheTask.origem.contactId) || null}
          onClose={() => setDetalheTask(null)}
          onResposta={onResposta?.[detalheTask.origem.tipo]}
          onSetTaskEstado={onSetTaskEstado}
          showToast={showToast}
          remetente={remetente}
          soLeitura={soLeitura}
          dadosEquipa={dadosEquipa}
        />
      )}
    </div>
  );
}

/* ---------- Documentos: repositório partilhado pela equipa (acordo com o IPO e outra documentação) ---------- */
function DocumentosModule({ documents, persistDocuments, user, showToast, soLeitura }) {
  const [search, setSearch] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("Todas");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const list = documents || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((d) => {
      if (filterCategoria !== "Todas" && d.categoria !== filterCategoria) return false;
      if (q && !(`${d.titulo} ${d.notas}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [list, search, filterCategoria]);

  const saveDocument = async (data) => {
    const withMeta = {
      ...data, atualizadoPor: user, criadoPor: data.criadoPor || user,
      criadoEm: data.criadoEm || new Date().toISOString(),
    };
    let next;
    if (modal === "add") next = [withMeta, ...list];
    else next = list.map((d) => (d.id === withMeta.id ? withMeta : d));
    await persistDocuments(next);
    setModal(null);
    setEditing(null);
    showToast(modal === "add" ? `Documento "${withMeta.titulo}" adicionado.` : `Documento "${withMeta.titulo}" atualizado.`);
  };

  const confirmDelete = async () => {
    const next = list.filter((d) => d.id !== toDelete.id);
    await persistDocuments(next);
    showToast(`Documento "${toDelete.titulo}" removido.`);
    setModal(null);
    setToDelete(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 24, color: C.ink }}>Documentos</div>
        </div>
        {!soLeitura && (
          <button onClick={() => { setEditing(blankDocument()); setModal("add"); }} style={btnPrimary}>
            <Plus size={15} /> Adicionar Documento
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={15} color={C.gray} style={{ position: "absolute", left: 12, top: 11 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar documentos…"
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>
        <select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)} style={selectStyle}>
          <option value="Todas">Categoria: Todas</option>
          {DOC_CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.line}`, padding: "50px 20px", textAlign: "center", color: C.inkSoft }}>
          <FileText size={28} color={C.gray} style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Sem documentos para mostrar</div>
          <div style={{ fontSize: 13.5 }}>Adiciona aqui a documentação de referência da equipa — por exemplo, o acordo com o IPO, contratos ou outros documentos importantes.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map((d) => (
            <div key={d.id} style={{ background: C.panel, borderRadius: 14, border: `1px solid ${C.line}`, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={16} color={C.accent} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: C.ink, fontSize: 14.5, wordBreak: "break-word" }}>{d.titulo}</div>
                    <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 999, background: C.grayBg, color: C.inkSoft, fontSize: 11, fontWeight: 600 }}>{d.categoria}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  {!soLeitura && (
                    <>
                      <button onClick={() => { setEditing(d); setModal("edit"); }} style={iconBtn} title="Editar"><Pencil size={14} /></button>
                      <button onClick={() => { setToDelete(d); setModal("delete"); }} style={iconBtn} title="Eliminar"><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
              {d.notas && <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{d.notas}</div>}
              {d.link ? (
                <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ ...btnGhost, textDecoration: "none", justifyContent: "center", marginTop: "auto" }}>
                  <ExternalLink size={14} /> Abrir documento
                </a>
              ) : (
                <div style={{ fontSize: 11.5, color: C.gray, fontStyle: "italic", marginTop: "auto" }}>Sem link associado</div>
              )}
            </div>
          ))}
        </div>
      )}

      {(modal === "add" || modal === "edit") && (
        <DocumentoModal
          data={editing}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={saveDocument}
          isNew={modal === "add"}
        />
      )}

      {modal === "delete" && toDelete && (
        <ConfirmModal
          title="Eliminar documento"
          message={`Tens a certeza que queres eliminar "${toDelete.titulo}"? Esta ação não pode ser desfeita.`}
          onCancel={() => { setModal(null); setToDelete(null); }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function DocumentoModal({ data, onClose, onSave, isNew }) {
  const [form, setForm] = useState({ ...data });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onSave(form);
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
          {isNew ? "Adicionar Documento" : "Editar Documento"}
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid" style={{ padding: "18px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "60vh", overflowY: "auto" }}>
          <Field label="Título" span2>
            <input required style={inputStyle} value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex.: Acordo com o IPO" />
          </Field>
          <Field label="Categoria">
            <select style={selectStyle} value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
              {DOC_CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Link do documento">
            <input type="url" style={inputStyle} value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Notas" span2>
            <textarea rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} value={form.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Contexto, resumo ou instruções sobre este documento…" />
          </Field>
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Cancelar</button>
          <button type="submit" style={btnPrimary}>{isNew ? "Adicionar" : "Guardar alterações"}</button>
        </div>
      </form>
    </Overlay>
  );
}


/* mostra o template de email correto para a fase/tipo de contacto (sem o utilizador ter de o procurar)
   e permite indicar diretamente se houve resposta — sem precisar de abrir o contacto separadamente.
   É a mesma lógica (e os mesmos dados) da secção "Seguimento" do contacto, agora acessível a partir da
   própria tarefa, para o fluxo ficar sempre sincronizado entre tarefas, contactos e templates. */
function AutoTaskModal({ task, templates, contact, onClose, onResposta, onSetTaskEstado, showToast, remetente, soLeitura, dadosEquipa }) {
  const [busy, setBusy] = useState(false);
  const origem = task.origem || {};
  const tipoInfo = TIPOS_CONTACTO[origem.tipo] || {};
  const fase = origem.evento === "followup" ? origem.fase : 1;
  const categoria = tipoInfo.categoriaTemplate;
  const tmpl = (templates || []).find((t) => t.categoria === categoria && Number(t.fase) === fase) || null;
  // Quem assina é o responsável atribuído ao contacto. Sem responsável, usa-se
  // quem está a enviar, para o e-mail não sair sem assinatura nenhuma.
  const assina = (contact?.responsavel && dadosEquipa?.[contact.responsavel]) || remetente;
  const preview = tmpl ? aplicarVariaveisContacto(tmpl.assunto, tmpl.corpo, contact || {}, origem.tipo, assina) : null;

  // Faltando o cargo ou o departamento de quem assina, as frases do template
  // ficam truncadas ("sou  no departamento de ."). Vale mais avisar do que
  // deixar sair um e-mail assim para uma agência.
  const assinaturaIncompleta = tmpl && (!assina?.nome || !assina?.cargo || !assina?.departamento);

  // a tarefa representa a fase atualmente ativa do seguimento deste contacto — só faz sentido
  // registar resposta enquanto isso for verdade (evita duplicar ações quando já existe um follow-up
  // mais recente para o mesmo contacto)
  const faseEhAtual = contact && (contact.faseFollowup || 1) === fase;
  // Em modo visitante o template é visível, mas registar resposta ou marcar
  // contacto alteraria o seguimento — fica de fora.
  const podeRegistarResposta = !soLeitura && !!contact && !!contact.aguardaResposta && faseEhAtual;
  const podeIniciarSeguimento = !soLeitura && !!contact && !contact.aguardaResposta && !origem.evento && task.estado !== "Concluída";

  const clicarResposta = async (teveResposta) => {
    if (!onResposta) return;
    setBusy(true);
    try {
      const updated = await onResposta(contact.id, teveResposta);
      if (updated && task.estado !== "Concluída") {
        await onSetTaskEstado(task, "Concluída");
      }
      if (updated) onClose();
    } finally {
      setBusy(false);
    }
  };

  const clicarIniciarSeguimento = async () => {
    setBusy(true);
    try {
      // onSetTaskEstado já trata de iniciar o seguimento automaticamente quando esta é a tarefa de
      // primeiro contacto e o contacto ainda não estava "a aguardar resposta" (ver setTaskEstado em
      // App) — chamar apenas esta função evita duplicar o efeito com dois pedidos em sequência.
      await onSetTaskEstado(task, "Concluída");
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Overlay onClose={onClose} wide>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink, marginBottom: 6 }}>{task.titulo}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 999, background: C.grayBg, color: C.inkSoft, fontSize: 11, fontWeight: 600 }}>
              {tipoInfo.label || "Contacto"}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.inkSoft }}>{origem.evento === "followup" ? `Follow-up — Fase ${fase}` : "Primeiro contacto"}</span>
            {contact && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 999, background: estadoInfo(contact.estado).bg, color: estadoInfo(contact.estado).color, fontSize: 11, fontWeight: 600 }}>
                {contact.estado}
              </span>
            )}
          </div>
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>

      <div style={{ padding: "18px 24px", maxHeight: "58vh", overflowY: "auto" }}>
        {!contact ? (
          <div style={{ color: C.inkSoft, fontSize: 13.5, padding: "20px 0", textAlign: "center" }}>
            Este contacto já não existe (poderá ter sido eliminado).
          </div>
        ) : (
          <>
            <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 2 }}>{contact.nome}</div>
              <div style={{ fontSize: 12.5, color: C.inkSoft }}>
                {contact.email || "sem email definido"}{contact.responsavel ? ` · responsável: ${contact.responsavel}` : ""}
              </div>
            </div>

            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, letterSpacing: 0.3, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
              <Mails size={12} /> TEMPLATE DE EMAIL DESTA FASE
            </div>
            {assinaturaIncompleta && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 9, background: C.amberBg, color: C.amber, fontSize: 12.5, fontWeight: 500, marginBottom: 12, lineHeight: 1.5 }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  {!contact?.responsavel
                    ? "Este contacto não tem responsável atribuído, por isso a assinatura fica incompleta. Atribui um responsável antes de enviar."
                    : `Faltam dados de ${assina?.nome || contact.responsavel} (cargo ou departamento), por isso a assinatura fica incompleta.`}
                </span>
              </div>
            )}
            {tmpl ? (
              <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
                <TemplatePreviewContent assunto={preview.assunto} corpo={preview.corpo} />
              </div>
            ) : (
              <div style={{ color: C.inkSoft, fontSize: 13, padding: "14px 0", marginBottom: 18 }}>
                Ainda não existe um template criado para esta fase ({categoria}, Fase {fase}). Cria um no módulo "Templates de Email" para ficar automaticamente associado.
              </div>
            )}

            <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
              {podeIniciarSeguimento ? (
                <>
                  <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12, lineHeight: 1.5 }}>
                    Este contacto ainda não tem nenhum e-mail registado a partir da plataforma. Envia o template acima (secção "Comunicação" do contacto) ou marca abaixo que já foi feito o primeiro contacto por outra via — isso inicia automaticamente o acompanhamento/follow-up.
                  </div>
                  <button type="button" disabled={busy} onClick={clicarIniciarSeguimento} style={{ ...btnPrimary, opacity: busy ? 0.6 : 1 }}>
                    <Send size={15} /> Marcar como contactado
                  </button>
                </>
              ) : podeRegistarResposta ? (
                <>
                  <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 12, lineHeight: 1.5 }}>
                    Depois de enviares este template, indica aqui se o contacto respondeu. Se ainda não respondeu, a plataforma cria automaticamente o follow-up da fase seguinte, respeitando o intervalo definido.
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="button" disabled={busy} onClick={() => clicarResposta(true)} style={{ ...btnGhost, opacity: busy ? 0.6 : 1 }}>
                      <CheckCircle2 size={15} color={C.green} /> Respondeu
                    </button>
                    <button type="button" disabled={busy} onClick={() => clicarResposta(false)} style={{ ...btnGhost, opacity: busy ? 0.6 : 1 }}>
                      <XCircle size={15} color={C.amber} /> Ainda não respondeu
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ color: C.inkSoft, fontSize: 13, lineHeight: 1.5 }}>
                  {task.estado === "Concluída"
                    ? "Esta tarefa já está concluída."
                    : "Esta fase já não é a fase ativa do seguimento deste contacto — consulta a secção \"Seguimento\" do contacto para o estado atual."}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={onClose} style={btnGhost}>Fechar</button>
      </div>
    </Overlay>
  );
}

function TaskModal({ data, onClose, onSave, isNew, members }) {
  const [form, setForm] = useState({ ...data });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onSave(form);
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, color: C.ink }}>
          {isNew ? "Nova Tarefa" : form.titulo || "Editar Tarefa"}
        </div>
        <button onClick={onClose} style={iconBtn}><X size={17} /></button>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid" style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Título *" span2>
            <input required style={inputStyle} value={form.titulo} onChange={(e) => set("titulo", e.target.value)} />
          </Field>
          <Field label="Responsável">
            <select style={selectStyle} value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)}>
              <option value="">Por atribuir</option>
              {(members?.length ? members : EQUIPA).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Prioridade">
            <select style={selectStyle} value={form.prioridade || "Média"} onChange={(e) => set("prioridade", e.target.value)}>
              {PRIORIDADES_TAREFA.map((p) => <option key={p.v} value={p.v}>{p.v}</option>)}
            </select>
          </Field>
          <Field label="Data limite">
            <input type="date" style={inputStyle} value={form.dataLimite} onChange={(e) => set("dataLimite", e.target.value)} />
          </Field>
          <Field label="Estado" span2>
            <select style={selectStyle} value={form.estado} onChange={(e) => set("estado", e.target.value)}>
              {ESTADOS_TAREFA.map((e) => <option key={e.v} value={e.v}>{e.v}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Cancelar</button>
          <button type="submit" style={btnPrimary}>{isNew ? "Adicionar" : "Guardar alterações"}</button>
        </div>
      </form>
    </Overlay>
  );
}

function ConfirmModal({ title, message, confirmLabel, onCancel, onConfirm, danger }) {
  return (
    <Overlay onClose={onCancel} narrow>
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.redBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <AlertTriangle size={19} color={C.red} />
        </div>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 16.5, color: C.ink, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5 }}>{message}</div>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onCancel} style={btnGhost}>Cancelar</button>
        <button onClick={onConfirm} style={{ ...btnPrimary, background: C.red }}>{confirmLabel}</button>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose, narrow, wide, xl }) {
  // Renderizado no `body`, fora da árvore onde foi chamado. Um modal aberto a
  // partir da barra lateral herdava o `overflow: hidden` e os 232px de largura
  // dela, o que o cortava e desalinhava.
  return createPortal(
    <div data-modal-aberto="true" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,20,30,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.panel, borderRadius: 16, width: "100%", maxWidth: narrow ? 400 : xl ? 880 : wide ? 760 : 620, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", fontFamily: "Inter, sans-serif" }}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function Field({ label, children, span2 }) {
  return (
    <div style={{ gridColumn: span2 ? "span 2" : "span 1" }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.line}`, fontSize: 13.5,
  fontFamily: "Inter, sans-serif", width: "100%", boxSizing: "border-box", outline: "none", color: C.ink,
};
const selectStyle = { ...inputStyle, background: "#fff", cursor: "pointer" };
const btnPrimary = {
  display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "none",
  background: C.accent, color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "Inter, sans-serif",
};
const btnGhost = {
  display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: `1px solid ${C.line}`,
  background: "#fff", color: C.ink, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "Inter, sans-serif",
};
const iconBtn = {
  border: "none", background: "transparent", color: C.inkSoft, cursor: "pointer", padding: 6, borderRadius: 7,
  display: "flex", alignItems: "center", justifyContent: "center",
};
const tabBtn = (active) => ({
  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "8px 8px 0 0",
  border: "none", borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
  background: "transparent", color: active ? C.ink : C.inkSoft, fontWeight: 600, fontSize: 13,
  cursor: "pointer", fontFamily: "Inter, sans-serif",
});
const toolBtn = {
  border: "none", background: "transparent", color: C.inkSoft, cursor: "pointer", padding: "6px 8px",
  borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
};
const varChip = {
  display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 9px", borderRadius: 999,
  border: `1px solid ${C.line}`, background: C.grayBg, color: C.inkSoft, fontSize: 11.5, fontWeight: 600,
  cursor: "pointer", fontFamily: "Inter, sans-serif",
};

/* =========================================================================================
   DASHBOARD & ESTATÍSTICAS
   Tudo nesta secção é calculado a partir dos dados já existentes (artistas, espaços,
   parceiros, tarefas e respetivos históricos) — não introduz nenhum campo que a equipa
   tenha de preencher manualmente. Os únicos valores "de configuração" são as metas
   semanais de gamificação abaixo, que são constantes do sistema (ajustáveis por quem
   desenvolve a plataforma), não dados inseridos pela equipa.
   ========================================================================================= */

// ---------- metas de gamificação (constantes do sistema, não são dados introduzidos pela equipa) ----------
const META_SEMANAL_EMAILS = 5;         // e-mails enviados, por pessoa, por semana
const META_SEMANAL_TAREFAS = 3;        // tarefas concluídas, por pessoa, por semana
const META_SEMANAL_EQUIPA_CONFIRMACOES = 3; // novos "Confirmado" (equipa toda), por semana
const SEMANAS_EVOLUCAO = 8; // nº de semanas mostradas no gráfico de evolução

// ---------- utilitários de datas ----------
const aChaveDia = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};
const inicioDaSemana = (d) => {
  const dt = new Date(d);
  const dia = (dt.getDay() + 6) % 7; // 0 = segunda
  dt.setHours(0, 0, 0, 0);
  dt.setDate(dt.getDate() - dia);
  return dt;
};
const adicionarDias = (d, n) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt;
};
const diffDias = (a, b) => Math.floor((new Date(a).getTime() - new Date(b).getTime()) / 86400000);
const rotuloSemana = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
// devolve quem praticou o evento (envio de email usa "enviadoPor", os restantes usam "user")
const autorDoEvento = (ev) => ev.enviadoPor || ev.user || "sistema";

const CATEGORIAS_NEGOCIACAO = ["A aguardar resposta", "Pediu mais informações", "Positivo / Disponível"];
// nº de dias sem qualquer movimento (contacto, envio ou evento no histórico) a partir do qual um
// contacto passa a contar como "morto"/parado na secção do Dashboard
const DIAS_CONTACTO_PARADO = 21;

function DashboardModule({ artists, spaces, partners, tasks, members, user, soLeitura }) {
  const allContacts = useMemo(() => ([
    ...(artists || []).map((c) => ({ ...c, _tipo: "artista", _tipoLabel: "Artista" })),
    ...(spaces || []).map((c) => ({ ...c, _tipo: "espaco", _tipoLabel: "Espaço" })),
    ...(partners || []).map((c) => ({ ...c, _tipo: "parceiro", _tipoLabel: "Parceiro" })),
  ]), [artists, spaces, partners]);

  const allTasks = tasks || [];
  const hoje = new Date();
  const hojeChave = aChaveDia(hoje);

  // filtro por responsável — usado apenas para escolher de quem mostrar a secção "Estatísticas
  // individuais" (e para destacar o cartão ativo em "Equipa"). As restantes secções do Dashboard
  // ("Visão geral", "Evolução", "Desempenho da equipa", "Tarefas da equipa", contactos em risco/
  // parados) mostram sempre os dados de toda a equipa, independentemente do cartão selecionado.
  const [filterRespRaw, setFilterResp] = useState("Todos");
  // segurança adicional: apenas os líderes podem filtrar as estatísticas individuais por outro
  // membro da equipa (mesmo que o estado interno seja alterado por alguma via inesperada, o valor
  // efetivo usado é sempre "Todos" para quem não é líder)
  const filterResp = isLider(user) ? filterRespRaw : "Todos";

  /* ---------- visão geral ---------- */
  const overview = useMemo(() => {
    const total = allContacts.length;
    const porContactar = allContacts.filter((c) => c.estado === "Por contactar").length;
    const emNegociacao = allContacts.filter((c) => CATEGORIAS_NEGOCIACAO.includes(c.estado)).length;
    const confirmados = allContacts.filter((c) => c.estado === "Confirmado").length;
    const recusados = allContacts.filter((c) => c.estado === "Recusado").length;
    const progresso = total ? Math.round((confirmados / total) * 100) : 0;
    const porCategoria = [
      { label: "Artistas", value: allContacts.filter((c) => c._tipo === "artista").length, color: C.accent },
      { label: "Espaços", value: allContacts.filter((c) => c._tipo === "espaco").length, color: C.teal },
      { label: "Parceiros", value: allContacts.filter((c) => c._tipo === "parceiro").length, color: C.green },
    ];
    return { total, porContactar, emNegociacao, confirmados, recusados, progresso, porCategoria };
  }, [allContacts]);

  /* ---------- eventos do histórico, achatados (partilhados por várias métricas abaixo) ---------- */
  const allEvents = useMemo(() => {
    const evs = [];
    allContacts.forEach((c) => {
      (c.historico || []).forEach((h) => evs.push({ ...h, _contactId: c.id, _contactNome: c.nome, _contactTipo: c._tipo }));
    });
    return evs;
  }, [allContacts]);

  /* ---------- evolução ao longo do tempo (últimas N semanas) ---------- */
  const evolucao = useMemo(() => {
    const semanaAtualInicio = inicioDaSemana(hoje);
    const semanas = [];
    for (let i = SEMANAS_EVOLUCAO - 1; i >= 0; i--) {
      const inicio = adicionarDias(semanaAtualInicio, -7 * i);
      semanas.push({ inicio, fim: adicionarDias(inicio, 6), emails: 0, respostas: 0, confirmados: 0 });
    }
    const encontrarSemana = (data) => {
      const t = new Date(data).getTime();
      return semanas.find((s) => t >= s.inicio.getTime() && t < adicionarDias(s.fim, 1).getTime());
    };
    allEvents.forEach((ev) => {
      const s = encontrarSemana(ev.data);
      if (!s) return;
      if (ev.tipo === "email") s.emails += 1;
      else if (ev.tipo === "resposta") s.respostas += 1;
      else if (ev.tipo === "estado" && ev.para === "Confirmado") s.confirmados += 1;
    });
    return semanas;
  }, [allEvents, hoje]);

  /* ---------- taxa de resposta: primeiro contacto vs. follow-ups ---------- */
  const taxasResposta = useMemo(() => {
    let primeiroEnviados = 0, primeiroRespondidos = 0, followupEnviados = 0, followupRespondidos = 0, followupsCriados = 0;
    let somaDiasResposta = 0, contagemDiasResposta = 0;
    allContacts.forEach((c) => {
      const hist = [...(c.historico || [])].reverse(); // ordem cronológica (mais antigo primeiro)
      let onda = null; // 'primeiro' | 'followup' | null — a que envio estamos à espera de resposta
      let vistoPrimeiroEmail = false;
      let dataUltimoEnvio = null;
      hist.forEach((ev) => {
        if (ev.tipo === "email") {
          dataUltimoEnvio = ev.data;
          if (!vistoPrimeiroEmail) {
            vistoPrimeiroEmail = true;
            primeiroEnviados += 1;
            onda = "primeiro";
          } else {
            followupEnviados += 1;
            onda = "followup";
          }
        } else if (ev.tipo === "followup_criado") {
          followupsCriados += 1;
        } else if (ev.tipo === "resposta") {
          if (onda === "primeiro") primeiroRespondidos += 1;
          else if (onda === "followup") followupRespondidos += 1;
          if (dataUltimoEnvio) {
            const dias = diffDias(ev.data, dataUltimoEnvio);
            if (dias >= 0) { somaDiasResposta += dias; contagemDiasResposta += 1; }
          }
          onda = null;
        }
      });
    });
    const primeiro = primeiroEnviados ? Math.round((primeiroRespondidos / primeiroEnviados) * 100) : 0;
    const followup = followupEnviados ? Math.round((followupRespondidos / followupEnviados) * 100) : 0;
    const tempoMedioResposta = contagemDiasResposta ? (somaDiasResposta / contagemDiasResposta) : null;
    return { primeiro, followup, primeiroEnviados, primeiroRespondidos, followupEnviados, followupRespondidos, followupsCriados, tempoMedioResposta };
  }, [allContacts]);

  /* ---------- desempenho por membro da equipa ---------- */
  const porMembro = useMemo(() => {
    const mapa = {};
    const garantir = (m) => {
      if (!m) return null;
      if (!mapa[m]) mapa[m] = { membro: m, emails: 0, respostas: 0, confirmados: 0, tarefasConcluidas: 0, tarefasAtribuidas: 0, contactosAtribuidos: 0, diasAtividade: new Set() };
      return mapa[m];
    };
    (members || []).forEach((m) => garantir(m));

    allEvents.forEach((ev) => {
      const autor = autorDoEvento(ev);
      if (autor === "sistema") return;
      const registo = garantir(autor);
      if (!registo) return;
      if (ev.tipo === "email") { registo.emails += 1; registo.diasAtividade.add(aChaveDia(ev.data)); }
      if (ev.tipo === "resposta") { registo.respostas += 1; registo.diasAtividade.add(aChaveDia(ev.data)); }
      if (ev.tipo === "estado" && ev.para === "Confirmado") { registo.confirmados += 1; registo.diasAtividade.add(aChaveDia(ev.data)); }
      if (ev.tipo === "nota") registo.diasAtividade.add(aChaveDia(ev.data));
    });

    allTasks.forEach((t) => {
      if (!t.responsavel) return;
      const registo = garantir(t.responsavel);
      if (!registo) return;
      registo.tarefasAtribuidas += 1;
      if (t.estado === "Concluída") {
        registo.tarefasConcluidas += 1;
        if (t.concluidaEm) registo.diasAtividade.add(aChaveDia(t.concluidaEm));
      }
    });

    allContacts.forEach((c) => { if (c.responsavel) garantir(c.responsavel).contactosAtribuidos += 1; });

    // sequência de dias consecutivos com atividade, terminando hoje ou ontem
    Object.values(mapa).forEach((registo) => {
      let streak = 0;
      let cursor = new Date(hoje);
      if (!registo.diasAtividade.has(aChaveDia(cursor)) && registo.diasAtividade.has(aChaveDia(adicionarDias(cursor, -1)))) {
        cursor = adicionarDias(cursor, -1);
      }
      while (registo.diasAtividade.has(aChaveDia(cursor))) {
        streak += 1;
        cursor = adicionarDias(cursor, -1);
      }
      registo.streak = streak;
    });

    return Object.values(mapa).sort((a, b) => (b.emails + b.tarefasConcluidas) - (a.emails + a.tarefasConcluidas));
  }, [allEvents, allTasks, allContacts, members, hoje]);

  /* ---------- semana atual (para as metas de gamificação) ---------- */
  const semanaAtual = useMemo(() => {
    const inicio = inicioDaSemana(hoje);
    const fim = adicionarDias(inicio, 6);
    const dentro = (d) => {
      const t = new Date(d).getTime();
      return t >= inicio.getTime() && t < adicionarDias(fim, 1).getTime();
    };
    const emailsSemana = {}; const tarefasSemana = {};
    allEvents.forEach((ev) => {
      if (ev.tipo === "email" && dentro(ev.data)) {
        const autor = autorDoEvento(ev);
        emailsSemana[autor] = (emailsSemana[autor] || 0) + 1;
      }
    });
    allTasks.forEach((t) => {
      if (t.estado === "Concluída" && t.concluidaEm && dentro(t.concluidaEm) && t.responsavel) {
        tarefasSemana[t.responsavel] = (tarefasSemana[t.responsavel] || 0) + 1;
      }
    });
    const confirmacoesEquipa = allEvents.filter((ev) => ev.tipo === "estado" && ev.para === "Confirmado" && dentro(ev.data)).length;
    return { inicio, fim, emailsSemana, tarefasSemana, confirmacoesEquipa };
  }, [allEvents, allTasks, hoje]);

  /* ---------- conquistas / medalhas ---------- */
  const DEFINICOES_MEDALHAS = [
    { id: "primeiro_email", label: "Primeiro Contacto", desc: "Enviou o primeiro e-mail", icon: Send, cor: C.teal, check: (m) => m.emails >= 1 },
    { id: "5_emails", label: "Maratonista", desc: "5 e-mails enviados", icon: Mail, cor: C.accent, check: (m) => m.emails >= 5 },
    { id: "15_emails", label: "Imparável", desc: "15 e-mails enviados", icon: Zap, cor: C.accent, check: (m) => m.emails >= 15 },
    { id: "primeira_vitoria", label: "Primeira Vitória", desc: "Conseguiu o primeiro \"Confirmado\"", icon: Sparkles, cor: C.green, check: (m) => m.confirmados >= 1 },
    { id: "5_tarefas", label: "Produtivo", desc: "5 tarefas concluídas", icon: CheckSquare, cor: C.green, check: (m) => m.tarefasConcluidas >= 5 },
    { id: "streak_3", label: "Consistente", desc: "3 dias seguidos com atividade", icon: Flame, cor: C.amber, check: (m) => m.streak >= 3 },
    { id: "streak_7", label: "Imbatível", desc: "7 dias seguidos com atividade", icon: Trophy, cor: C.amber, check: (m) => m.streak >= 7 },
  ];

  const medalhasUser = useMemo(() => {
    const registo = porMembro.find((m) => m.membro === user) || { emails: 0, confirmados: 0, tarefasConcluidas: 0, streak: 0 };
    return DEFINICOES_MEDALHAS.map((d) => ({ ...d, atingida: d.check(registo) }));
  }, [porMembro, user]);

  /* ---------- tarefas: concluídas, pendentes, em atraso ---------- */
  const tarefasStats = useMemo(() => {
    const concluidas = allTasks.filter((t) => t.estado === "Concluída").length;
    const emProgresso = allTasks.filter((t) => t.estado === "Em progresso").length;
    const porFazer = allTasks.filter((t) => t.estado === "Por fazer").length;
    const atrasadas = allTasks.filter((t) => t.estado !== "Concluída" && t.dataLimite && t.dataLimite < hojeChave);
    return { concluidas, emProgresso, porFazer, pendentes: emProgresso + porFazer, atrasadas };
  }, [allTasks, hojeChave]);

  /* ---------- contactos que precisam de atenção (aguardam resposta há muito tempo) ---------- */
  const contactosEmRisco = useMemo(() => {
    return allContacts
      .filter((c) => c.aguardaResposta && c.dataUltimoEnvio)
      .map((c) => ({ ...c, diasAEspera: diffDias(hoje, c.dataUltimoEnvio) }))
      .filter((c) => c.diasAEspera >= 7)
      .sort((a, b) => b.diasAEspera - a.diasAEspera)
      .slice(0, 6);
  }, [allContacts, hoje]);

  /* ---------- contactos "mortos" ou sem qualquer movimento há muito tempo ----------
     mais abrangente do que "contactosEmRisco": não depende de estar à espera de resposta a um
     e-mail — apanha também contactos parados num estado intermédio (ex.: "Pediu mais informações"
     ou "Positivo / Disponível" sem ninguém dar seguimento) e contactos que nunca chegaram a ser
     contactados. Contactos já fechados (Confirmado/Recusado) ficam de fora, porque já não precisam
     de ação. */
  const contactosParados = useMemo(() => {
    const comData = [];
    const semData = [];
    allContacts.forEach((c) => {
      if (ESTADOS_FINAIS.includes(c.estado)) return;
      const datas = [c.dataUltimoContacto, c.dataUltimoEnvio, ...(c.historico || []).map((h) => h.data)].filter(Boolean);
      if (datas.length === 0) { semData.push(c); return; }
      const ultimaAtividade = datas.reduce((max, d) => (new Date(d) > new Date(max) ? d : max));
      const diasParado = diffDias(hoje, ultimaAtividade);
      if (diasParado >= DIAS_CONTACTO_PARADO) comData.push({ ...c, diasParado });
    });
    comData.sort((a, b) => b.diasParado - a.diasParado);
    return {
      total: comData.length + semData.length,
      comAtividadeAntiga: comData.length,
      nuncaContactados: semData.length,
      linhas: [...comData, ...semData].slice(0, 8),
    };
  }, [allContacts, hoje]);

  /* ---------- distribuição por responsável ---------- */
  const distribuicaoResponsavel = useMemo(() => {
    const mapa = {};
    allContacts.forEach((c) => {
      const r = c.responsavel || "Por atribuir";
      mapa[r] = (mapa[r] || 0) + 1;
    });
    return Object.entries(mapa).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [allContacts]);

  const maxDistribuicao = Math.max(1, ...distribuicaoResponsavel.map((d) => d.value));
  const maxEmailsMembro = Math.max(1, ...porMembro.map((m) => m.emails));

  /* ---------- mensagem de incentivo, calculada a partir dos dados atuais ---------- */
  const mensagemIncentivo = useMemo(() => {
    const lider = [...porMembro].sort((a, b) => b.streak - a.streak)[0];
    const totalEmailsSemana = Object.values(semanaAtual.emailsSemana).reduce((s, v) => s + v, 0);
    if (lider && lider.streak >= 3) {
      return `🔥 ${lider.membro} está em sequência de ${lider.streak} dias seguidos com atividade — inspira a equipa!`;
    }
    if (semanaAtual.confirmacoesEquipa >= META_SEMANAL_EQUIPA_CONFIRMACOES) {
      return `🎉 Meta semanal da equipa atingida — já são ${semanaAtual.confirmacoesEquipa} confirmações esta semana!`;
    }
    if (totalEmailsSemana > 0) {
      return `📬 A equipa já enviou ${totalEmailsSemana} e-mail(s) esta semana. Continuem assim!`;
    }
    return "💡 Uma nova semana, uma nova oportunidade — vamos contactar mais artistas, espaços e parceiros!";
  }, [porMembro, semanaAtual]);

  const meuRegisto = porMembro.find((m) => m.membro === user) || { emails: 0, respostas: 0, confirmados: 0, tarefasConcluidas: 0, tarefasAtribuidas: 0, contactosAtribuidos: 0, streak: 0 };
  const emailsEstaSemanaEu = semanaAtual.emailsSemana[user] || 0;
  const tarefasEstaSemanaEu = semanaAtual.tarefasSemana[user] || 0;

  // ---------- bloco "estatísticas individuais" ----------
  // para os restantes membros da equipa mostra sempre a própria atividade (é a única pessoa cujas
  // estatísticas individuais podem consultar). Para os líderes, este bloco fica escondido enquanto
  // não houver nenhum cartão de membro selecionado na secção "Equipa" — assim que clicam num cartão,
  // este passa a funcionar como um filtro e mostra apenas as estatísticas dessa pessoa.
  // O visitante não tem estatísticas próprias: as secções pessoais (as suas
  // metas, medalhas e números individuais) não fazem sentido e ficam de fora.
  const mostrarEstatisticasIndividuais = !soLeitura && (!isLider(user) || filterResp !== "Todos");
  // quando um cartão de membro está selecionado em "Equipa", as secções que mostram sempre dados
  // agregados de toda a equipa ("Visão geral", "Evolução", "Desempenho da equipa", "Tarefas da
  // equipa" e os avisos de contactos em risco/parados) ficam escondidas — só continua visível o
  // bloco de estatísticas individuais da pessoa selecionada.
  const semCartaoSelecionado = filterResp === "Todos";
  const alvoEstatisticasIndividuais = isLider(user) ? filterResp : user;
  const registoEstatisticasIndividuais = porMembro.find((m) => m.membro === alvoEstatisticasIndividuais)
    || { emails: 0, respostas: 0, confirmados: 0, tarefasConcluidas: 0, tarefasAtribuidas: 0, contactosAtribuidos: 0, streak: 0 };

  // painel "flutuante" branco usado pelos blocos de gráficos/estatísticas sobre o fundo azul do Dashboard
  const panelStyle = {
    background: "#FFFFFF",
    borderRadius: 18,
    padding: "18px 20px",
    boxShadow: "0 14px 32px rgba(6,15,40,0.18)",
    border: "1px solid rgba(255,255,255,0.5)",
  };

  return (
    <div style={{ position: "relative", minHeight: "100%", background: DASH_GRADIENT, overflow: "hidden" }}>
      {/* brilhos decorativos — mantêm o fio condutor rosa/azul da marca sobre o fundo escuro */}
      <div style={{ position: "absolute", inset: 0, background: DASH_GLOW, pointerEvents: "none" }} />

      <div style={{ position: "relative", padding: "34px 36px 52px" }}>

        {/* ---------- cabeçalho ---------- */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)", flexShrink: 0,
            }}>
              <LayoutDashboard size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 25, color: "#fff" }}>Dashboard & Estatísticas</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 999,
              background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff",
              fontSize: 12.5, fontWeight: 600, backdropFilter: "blur(6px)",
            }}>
              <UserCircle2 size={14} color={C.accent} /> Olá, {user}
            </div>
            {isLider(user) && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 999,
                background: "rgba(230,23,140,0.18)", border: "1px solid rgba(230,23,140,0.35)", color: "#fff",
                fontSize: 11.5, fontWeight: 700, backdropFilter: "blur(6px)",
              }}>
                <Award size={13} /> Líder de equipa
              </div>
            )}
          </div>
        </div>

        {/* ---------- equipa: cartões por membro — apenas os líderes podem filtrar o dashboard e
             consultar as estatísticas individuais de qualquer membro da equipa (clicar num cartão
             filtra as secções abaixo por essa pessoa; clicar de novo no cartão ativo remove o filtro) ---------- */}
        {isLider(user) && (
          <>
            <DashSectionTitle icon={Users} title="Equipa" subtitle="Clica num cartão para veres apenas o trabalho e as estatísticas desse membro" />
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(190px, 1fr))`, gap: 12, marginBottom: 30 }}>
              {EQUIPA.map((m) => {
                const reg = porMembro.find((x) => x.membro === m) || { emails: 0, confirmados: 0, tarefasConcluidas: 0, contactosAtribuidos: 0 };
                const ativo = filterResp === m;
                const iniciaisM = (m || "").trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFilterResp(ativo ? "Todos" : m)}
                    title={ativo ? `Remover filtro de "${m}"` : `Filtrar o dashboard por "${m}"`}
                    style={{
                      textAlign: "left", cursor: "pointer", borderRadius: 14, padding: "14px 15px",
                      border: `1.5px solid ${ativo ? C.accent : "rgba(255,255,255,0.16)"}`,
                      background: ativo ? "rgba(230,23,140,0.20)" : "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(6px)", color: "#fff", fontFamily: "Inter, sans-serif",
                      transition: "background .15s ease, border-color .15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                        background: ativo ? C.accent : "rgba(255,255,255,0.16)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                      }}>
                        {iniciaisM}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m}</div>
                        {isLider(m) && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: 0.3 }}>LÍDER</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 10.5, color: "rgba(255,255,255,0.78)" }}>
                      <span>{reg.contactosAtribuidos} contactos</span>
                      <span>{reg.emails} e-mails</span>
                      <span>{reg.tarefasConcluidas} tarefas</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ---------- visão geral ---------- */}
        {semCartaoSelecionado && (
          <>
            <DashSectionTitle icon={LayoutDashboard} title="Visão geral do projeto" subtitle="Toda a equipa" />
            <div className="dash-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 16 }}>
              <DashStatCard label="Total de contactos" value={overview.total} icon={Users} accent="#9DB4FF" />
              <DashStatCard label="Por contactar" value={overview.porContactar} icon={HelpCircle} accent="#C7CEDE" />
              <DashStatCard label="Em negociação" value={overview.emNegociacao} icon={Clock} accent="#FFC876" />
              <DashStatCard label="Confirmados" value={overview.confirmados} icon={Sparkles} accent="#FF8FCB" />
              <DashStatCard label="Recusados" value={overview.recusados} icon={XCircle} accent="#FF9FAE" />
            </div>
            <div className="dash-grid-2" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 32 }}>
              <div style={panelStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>Progresso global até "Confirmado"</div>
                  <div style={{ fontWeight: 700, fontSize: 19, color: C.accent, fontFamily: "Space Grotesk, sans-serif" }}>{overview.progresso}%</div>
                </div>
                <ProgressBar value={overview.progresso} color={C.accent} />
                <div style={{ marginTop: 16 }}>
                  <FunilConversao overview={overview} />
                </div>
              </div>
              <div style={panelStyle}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 14 }}>Distribuição por categoria</div>
                <DonutChart segments={overview.porCategoria} />
              </div>
            </div>
          </>
        )}

        {/* ---------- estatísticas individuais ---------- */}
        {/* para os líderes só aparece depois de clicarem num cartão em "Equipa" (funciona como filtro
            para as estatísticas de um único membro); para os restantes membros mostra sempre a sua
            própria atividade */}
        {mostrarEstatisticasIndividuais && (
          <>
            <DashSectionTitle
              icon={UserCircle2}
              title={isLider(user) ? `Estatísticas de ${alvoEstatisticasIndividuais}` : "As tuas estatísticas"}
              subtitle={`Atividade individual de ${alvoEstatisticasIndividuais}`}
            />
            <div className="dash-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 32 }}>
              <DashStatCard label="Contactos atribuídos" value={registoEstatisticasIndividuais.contactosAtribuidos} icon={Users} accent="#9DB4FF" />
              <DashStatCard label="E-mails enviados" value={registoEstatisticasIndividuais.emails} icon={Mail} accent="#7FDCE6" />
              <DashStatCard label="Confirmados" value={registoEstatisticasIndividuais.confirmados} icon={Sparkles} accent="#FF8FCB" />
              <DashStatCard label="Tarefas concluídas" value={registoEstatisticasIndividuais.tarefasConcluidas} icon={CheckSquare} accent="#8FE0B4" />
              <DashStatCard label="Sequência ativa" value={`${registoEstatisticasIndividuais.streak}d`} icon={Flame} accent="#FFC876" />
            </div>
          </>
        )}

        {/* ---------- evolução ao longo do tempo ---------- */}
        {semCartaoSelecionado && (
          <>
            <DashSectionTitle icon={TrendingUp} title="Evolução dos contactos ao longo do tempo" subtitle={`Últimas ${SEMANAS_EVOLUCAO} semanas`} />
            <div style={{ ...panelStyle, padding: "20px 20px 10px", marginBottom: 32 }}>
              <EvolutionChart weeks={evolucao} />
            </div>
          </>
        )}

        {/* ---------- equipa: contactos, emails e taxas de resposta ---------- */}
        {semCartaoSelecionado && (
          <>
            <DashSectionTitle icon={BarChart3} title="Desempenho da equipa" />
            <div className="dash-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
              <DashStatCard label="Taxa de resposta — 1º contacto" value={`${taxasResposta.primeiro}%`} icon={Mail} accent="#7FDCE6" />
              <DashStatCard label="Taxa de resposta — follow-ups" value={`${taxasResposta.followup}%`} icon={Workflow} accent="#FFC876" />
              <DashStatCard label="Tempo médio de resposta" value={taxasResposta.tempoMedioResposta !== null ? `${taxasResposta.tempoMedioResposta.toFixed(1)} dias` : "—"} icon={Clock} accent="#C7CEDE" />
            </div>
            {isLider(user) ? (
              <div className="dash-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                <div style={panelStyle}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 14 }}>E-mails enviados por membro</div>
                  {porMembro.filter((m) => m.emails > 0 || m.tarefasConcluidas > 0 || m.contactosAtribuidos > 0).length === 0 ? (
                    <EmptyHint text="Ainda não há atividade registada pela equipa." />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {porMembro.filter((m) => m.emails > 0).sort((a, b) => b.emails - a.emails).map((m) => (
                        <BarRow key={m.membro} label={m.membro} value={m.emails} max={maxEmailsMembro} color={C.accent} />
                      ))}
                    </div>
                  )}
                </div>
            <div style={panelStyle}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 14 }}>Distribuição de contactos por responsável</div>
              {distribuicaoResponsavel.length === 0 ? (
                <EmptyHint text="Ainda não há contactos atribuídos." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {distribuicaoResponsavel.map((d) => (
                    <BarRow key={d.label} label={d.label} value={d.value} max={maxDistribuicao} color={d.label === "Por atribuir" ? C.gray : C.teal} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ ...panelStyle, marginBottom: 32, display: "flex", alignItems: "center", gap: 10, color: C.inkSoft, fontSize: 12.5 }}>
            <UserCircle2 size={16} color={C.gray} /> As estatísticas individuais de cada membro da equipa são visíveis apenas para os líderes.
          </div>
        )}
          </>
        )}

        {/* ---------- tarefas ---------- */}
        {semCartaoSelecionado && (
          <>
            <DashSectionTitle icon={ListChecks} title="Tarefas da equipa" />
            <div className="dash-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
              <DashStatCard label="Concluídas" value={tarefasStats.concluidas} icon={CheckSquare} accent="#8FE0B4" />
              <DashStatCard label="Pendentes (por fazer + em progresso)" value={tarefasStats.pendentes} icon={Clock} accent="#FFC876" />
              <DashStatCard label="Em atraso" value={tarefasStats.atrasadas.length} icon={AlertOctagon} accent="#FF9FAE" />
            </div>
            {tarefasStats.atrasadas.length > 0 && (
              <div style={{ ...panelStyle, background: C.redBg, boxShadow: "0 14px 32px rgba(176,57,74,0.22)", marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13, color: C.red, marginBottom: 10 }}>
                  <AlertTriangle size={14} /> Tarefas em atraso — precisam de atenção
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {tarefasStats.atrasadas.slice(0, 6).map((t) => (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.ink, background: "#fff", borderRadius: 9, padding: "8px 12px" }}>
                      <span style={{ fontWeight: 600 }}>{t.titulo}</span>
                      <span style={{ color: C.inkSoft }}>{t.responsavel || "por atribuir"} · limite {t.dataLimite}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------- contactos que precisam de atenção ---------- */}
        {semCartaoSelecionado && contactosEmRisco.length > 0 && (
          <>
            <DashSectionTitle icon={AlertOctagon} title="Contactos que precisam de atenção" subtitle="Aguardam resposta há 7 ou mais dias" />
            <div style={{ ...panelStyle, padding: 0, overflow: "hidden", marginBottom: 32 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {contactosEmRisco.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ padding: "12px 18px", fontWeight: 600, color: C.ink }}>{c.nome}</td>
                      <td style={{ padding: "12px 18px", color: C.inkSoft, fontSize: 12 }}>{c._tipoLabel}</td>
                      <td style={{ padding: "12px 18px", color: C.inkSoft, fontSize: 12 }}>{c.responsavel || "por atribuir"}</td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: C.red }}>{c.diasAEspera} dias sem resposta</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ---------- contactos mortos / sem qualquer movimento há muito tempo ---------- */}
        {semCartaoSelecionado && contactosParados.total > 0 && (
          <>
            <DashSectionTitle
              icon={AlertOctagon}
              title="Contactos mortos ou sem movimento"
              subtitle={`Sem qualquer atividade há ${DIAS_CONTACTO_PARADO}+ dias, ou nunca chegaram a ser contactados`}
            />
            <div className="dash-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
              <DashStatCard label="Total parados" value={contactosParados.total} icon={AlertOctagon} accent="#C7CEDE" />
              <DashStatCard label="Pararam a meio da negociação" value={contactosParados.comAtividadeAntiga} icon={Clock} accent="#FFC876" />
              <DashStatCard label="Nunca chegaram a ser contactados" value={contactosParados.nuncaContactados} icon={HelpCircle} accent="#C7CEDE" />
            </div>
            <div style={{ ...panelStyle, padding: 0, overflow: "hidden", marginBottom: 32 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {contactosParados.linhas.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td style={{ padding: "12px 18px", fontWeight: 600, color: C.ink }}>{c.nome}</td>
                      <td style={{ padding: "12px 18px", color: C.inkSoft, fontSize: 12 }}>{c._tipoLabel}</td>
                      <td style={{ padding: "12px 18px", color: C.inkSoft, fontSize: 12 }}>{c.responsavel || "por atribuir"}</td>
                      <td style={{ padding: "12px 18px", color: C.inkSoft, fontSize: 12 }}>{c.estado}</td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: C.gray }}>
                          {c.diasParado != null ? `${c.diasParado} dias sem movimento` : "Nunca contactado"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {contactosParados.total > contactosParados.linhas.length && (
                <div style={{ padding: "10px 18px", fontSize: 11.5, color: C.inkSoft, borderTop: `1px solid ${C.line}` }}>
                  + {contactosParados.total - contactosParados.linhas.length} outro(s) contacto(s) parado(s), não mostrados aqui.
                </div>
              )}
            </div>
          </>
        )}

        {/* ---------- gamificação ---------- */}
        <DashSectionTitle icon={Trophy} title="Motivação da equipa" subtitle="Objetivos, medalhas e consistência" />

        <div style={{ ...panelStyle, display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={18} color={C.accent} />
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{mensagemIncentivo}</div>
        </div>

        <div className="dash-grid-2" style={{ display: "grid", gridTemplateColumns: soLeitura ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {!soLeitura && (
          <div style={panelStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 12 }}>
              <Target size={14} color={C.accent} /> Os teus objetivos desta semana
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                <span style={{ color: C.inkSoft }}>E-mails enviados</span>
                <span style={{ fontWeight: 700, color: C.ink }}>{emailsEstaSemanaEu} / {META_SEMANAL_EMAILS}</span>
              </div>
              <ProgressBar value={Math.min(100, Math.round((emailsEstaSemanaEu / META_SEMANAL_EMAILS) * 100))} color={C.accent} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                <span style={{ color: C.inkSoft }}>Tarefas concluídas</span>
                <span style={{ fontWeight: 700, color: C.ink }}>{tarefasEstaSemanaEu} / {META_SEMANAL_TAREFAS}</span>
              </div>
              <ProgressBar value={Math.min(100, Math.round((tarefasEstaSemanaEu / META_SEMANAL_TAREFAS) * 100))} color={C.green} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, padding: "8px 10px", borderRadius: 9, background: C.amberBg }}>
              <Flame size={14} color={C.amber} />
              <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>
                {meuRegisto.streak > 0 ? `${meuRegisto.streak} dia(s) seguidos com atividade` : "Ainda sem sequência ativa esta semana"}
              </span>
            </div>
          </div>
          )}

          <div style={panelStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 12 }}>
              <Users size={14} color={C.teal} /> Objetivo global da equipa
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
              <span style={{ color: C.inkSoft }}>Novos "Confirmado" esta semana</span>
              <span style={{ fontWeight: 700, color: C.ink }}>{semanaAtual.confirmacoesEquipa} / {META_SEMANAL_EQUIPA_CONFIRMACOES}</span>
            </div>
            <ProgressBar value={Math.min(100, Math.round((semanaAtual.confirmacoesEquipa / META_SEMANAL_EQUIPA_CONFIRMACOES) * 100))} color={C.teal} />

            <div style={{ marginTop: 16, fontSize: 12, color: C.inkSoft, fontWeight: 600, marginBottom: 8 }}>Sequências ativas da equipa</div>
            {isLider(user) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {porMembro.filter((m) => m.streak > 0).sort((a, b) => b.streak - a.streak).slice(0, 5).map((m) => (
                  <div key={m.membro} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                    <span style={{ color: C.ink, fontWeight: 500 }}>{m.membro}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: C.amber, fontWeight: 700 }}><Flame size={12} />{m.streak}d</span>
                  </div>
                ))}
                {porMembro.filter((m) => m.streak > 0).length === 0 && <EmptyHint text="Ninguém com sequência ativa neste momento." />}
              </div>
            ) : (
              <EmptyHint text="As sequências individuais de cada membro são visíveis apenas para os líderes." />
            )}
          </div>
        </div>

        {!soLeitura && (
        <div style={{ ...panelStyle, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 14 }}>
            <Award size={14} color={C.accent} /> As tuas medalhas
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {medalhasUser.map((m) => {
              const MIcon = m.icon;
              return (
                <div key={m.id} title={m.desc} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 6,
                  padding: "14px 8px", borderRadius: 12, border: `1px solid ${m.atingida ? m.cor + "33" : C.line}`,
                  background: m.atingida ? m.cor + "14" : "#FAFBFC", opacity: m.atingida ? 1 : 0.55,
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: m.atingida ? m.cor : C.grayBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MIcon size={16} color={m.atingida ? "#fff" : C.gray} />
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: C.ink }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: C.inkSoft, lineHeight: 1.3 }}>{m.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

/* ---------- pequenos componentes visuais partilhados pelo Dashboard ---------- */

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12, marginTop: 4 }}>
      <Icon size={15} color={C.accent} />
      <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, fontFamily: "Space Grotesk, sans-serif" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11.5, color: C.inkSoft }}>· {subtitle}</div>}
    </div>
  );
}

function EmptyHint({ text }) {
  return <div style={{ fontSize: 12.5, color: C.gray, fontStyle: "italic", padding: "8px 0" }}>{text}</div>;
}

function ProgressBar({ value, color }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div style={{ height: 8, borderRadius: 999, background: C.grayBg, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${v}%`, background: color, borderRadius: 999, transition: "width .25s ease" }} />
    </div>
  );
}

function BarRow({ label, value, max, color }) {
  const pct = Math.max(2, Math.round((value / (max || 1)) * 100));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: C.ink, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        <span style={{ color: C.inkSoft, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{value}</span>
      </div>
      <div style={{ height: 7, borderRadius: 999, background: C.grayBg, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function FunilConversao({ overview }) {
  const etapas = [
    { label: "Por contactar", value: overview.porContactar, color: C.gray },
    { label: "Em negociação", value: overview.emNegociacao, color: C.amber },
    { label: "Confirmado", value: overview.confirmados, color: C.accent },
  ];
  const max = Math.max(1, ...etapas.map((e) => e.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {etapas.map((e) => (
        <div key={e.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 96, fontSize: 11.5, color: C.inkSoft, flexShrink: 0 }}>{e.label}</div>
          <div style={{ flex: 1, height: 16, borderRadius: 6, background: C.grayBg, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.max(4, Math.round((e.value / max) * 100))}%`, background: e.color, borderRadius: 6 }} />
          </div>
          <div style={{ width: 24, textAlign: "right", fontSize: 12, fontWeight: 700, color: C.ink }}>{e.value}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const raio = 46, centro = 60, espessura = 16;
  const circunferencia = 2 * Math.PI * raio;
  let acumulado = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <svg viewBox="0 0 120 120" width={120} height={120}>
        <circle cx={centro} cy={centro} r={raio} fill="none" stroke={C.grayBg} strokeWidth={espessura} />
        {total === 0 ? null : segments.map((seg) => {
          const fracao = seg.value / total;
          const comprimento = fracao * circunferencia;
          const offset = circunferencia - acumulado;
          acumulado += comprimento;
          return (
            <circle
              key={seg.label}
              cx={centro} cy={centro} r={raio} fill="none" stroke={seg.color} strokeWidth={espessura}
              strokeDasharray={`${comprimento} ${circunferencia - comprimento}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${centro} ${centro})`}
              strokeLinecap="butt"
            />
          );
        })}
        <text x={centro} y={centro - 3} textAnchor="middle" fontSize="18" fontWeight="700" fill={C.ink} fontFamily="Space Grotesk, sans-serif">{total}</text>
        <text x={centro} y={centro + 13} textAnchor="middle" fontSize="9" fill={C.inkSoft}>contactos</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 9, height: 9, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{seg.label}</div>
            <div style={{ fontSize: 12, color: C.inkSoft, marginLeft: "auto" }}>{seg.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvolutionChart({ weeks }) {
  const maxValor = Math.max(1, ...weeks.map((s) => Math.max(s.emails, s.respostas, s.confirmados)));
  const alturaMax = 110;
  const largura = 100 / weeks.length;
  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 12, fontSize: 11.5, color: C.inkSoft }}>
        <LegendaItem cor={C.accent} texto="E-mails enviados" />
        <LegendaItem cor={C.teal} texto="Respostas recebidas" />
        <LegendaItem cor={C.green} texto="Confirmados" />
      </div>
      <svg viewBox="0 0 100 130" width="100%" height={190} preserveAspectRatio="none">
        {weeks.map((s, i) => {
          const x = i * largura;
          const barW = largura / 4.2;
          const hE = (s.emails / maxValor) * alturaMax;
          const hR = (s.respostas / maxValor) * alturaMax;
          const hC = (s.confirmados / maxValor) * alturaMax;
          const baseY = 110;
          return (
            <g key={i}>
              <rect x={x + barW * 0.4} y={baseY - hE} width={barW} height={hE} fill={C.accent} rx={0.6} />
              <rect x={x + barW * 1.6} y={baseY - hR} width={barW} height={hR} fill={C.teal} rx={0.6} />
              <rect x={x + barW * 2.8} y={baseY - hC} width={barW} height={hC} fill={C.green} rx={0.6} />
              <line x1={x} y1={baseY} x2={x + largura} y2={baseY} stroke={C.line} strokeWidth={0.3} />
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", marginTop: -6 }}>
        {weeks.map((s, i) => (
          <div key={i} style={{ width: `${largura}%`, textAlign: "center", fontSize: 10, color: C.inkSoft }}>
            {rotuloSemana(s.inicio)}
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendaItem({ cor, texto }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: cor }} />
      <span>{texto}</span>
    </div>
  );
}

/* ---------- título de secção usado apenas no Dashboard (texto claro sobre o fundo azul) ---------- */
function DashSectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 14, marginTop: 4 }}>
      <Icon size={16} color={C.accent} />
      <div style={{ fontWeight: 700, fontSize: 15.5, color: "#fff", fontFamily: "Space Grotesk, sans-serif" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>· {subtitle}</div>}
    </div>
  );
}

/* ---------- cartão de estatística "em vidro" usado apenas no Dashboard, sobre o fundo azul ---------- */
function DashStatCard({ label, value, icon: Icon, accent }) {
  return (
    <div style={{
      position: "relative", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 16, padding: "16px 18px", backdropFilter: "blur(8px)", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -18, right: -18, width: 64, height: 64, borderRadius: 999, background: accent, opacity: 0.16 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "Space Grotesk, sans-serif" }}>{value}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{label}</div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={accent} />
        </div>
      </div>
    </div>
  );
}
