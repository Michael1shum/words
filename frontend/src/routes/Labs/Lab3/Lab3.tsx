import React, { useState, useMemo } from 'react';
import './Lab3.scss';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const h = 6.626e-34;
const c = 3e8;

const presetData = [
  { mu: 0.1, alpha: 79.93, Nimp: 1, C: 30, Cdc: 3 },
  { mu: 0.1, alpha: 79.93, Nimp: 10, C: 251, Cdc: 31 },
  { mu: 0.1, alpha: 79.93, Nimp: 100, C: 2281, Cdc: 313 },
  { mu: 0.1, alpha: 79.93, Nimp: 1000, C: 14495, Cdc: 3120 },
  { mu: 0.2, alpha: 76.92, Nimp: 1, C: 59, Cdc: 3 },
  { mu: 0.2, alpha: 76.92, Nimp: 10, C: 577, Cdc: 31 },
  { mu: 0.2, alpha: 76.92, Nimp: 100, C: 4178, Cdc: 313  },
  { mu: 0.2, alpha: 76.92, Nimp: 1000, C: 20116, Cdc: 3120  },
  { mu: 0.3, alpha: 75.16, Nimp: 1, C: 74, Cdc: 3},
  { mu: 0.3, alpha: 75.16, Nimp: 10, C: 813, Cdc: 31 },
  { mu: 0.3, alpha: 75.16, Nimp: 100, C: 5466, Cdc: 313  },
  { mu: 0.3, alpha: 75.16, Nimp: 1000, C: 23323, Cdc: 3120  },
  { mu: 0.4, alpha: 73.91, Nimp: 1, C: 114, Cdc: 3 },
  { mu: 0.4, alpha: 73.91, Nimp: 10, C: 1037, Cdc: 31 },
  { mu: 0.4, alpha: 73.91, Nimp: 100, C: 6532, Cdc: 313  },
  { mu: 0.4, alpha: 73.91, Nimp: 1000, C: 25077, Cdc: 3120  },
  { mu: 0.5, alpha: 72.94, Nimp: 1, C: 175, Cdc: 3 },
  { mu: 0.5, alpha: 72.94, Nimp: 10, C: 1267, Cdc: 31 },
  { mu: 0.5, alpha: 72.94, Nimp: 100, C: 7136, Cdc: 313  },
  { mu: 0.5, alpha: 72.94, Nimp: 1000, C: 25999, Cdc: 3120  },
  { mu: 0.6, alpha: 72.15, Nimp: 1, C: 156,Cdc: 3 },
  { mu: 0.6, alpha: 72.15, Nimp: 10, C: 1592, Cdc: 31 },
  { mu: 0.6, alpha: 72.15, Nimp: 100, C: 7582, Cdc: 313 },
  { mu: 0.6, alpha: 72.15, Nimp: 1000, C: 26589,Cdc: 3120  },
  { mu: 0.7, alpha: 71.48, Nimp: 1, C: 178, Cdc: 3 },
  { mu: 0.7, alpha: 71.48, Nimp: 10, C: 1761, Cdc: 31 },
  { mu: 0.7, alpha: 71.48, Nimp: 100, C: 7873, Cdc: 313 },
  { mu: 0.7, alpha: 71.48, Nimp: 1000, C: 26879, Cdc: 3120 },
  { mu: 0.8, alpha: 70.90, Nimp: 1, C: 250, Cdc: 3 },
  { mu: 0.8, alpha: 70.90, Nimp: 10, C: 2036, Cdc: 31},
  { mu: 0.8, alpha: 70.90, Nimp: 100, C: 7951, Cdc: 313 },
  { mu: 0.8, alpha: 70.90, Nimp: 1000, C: 27180, Cdc: 3120  },
  { mu: 0.9, alpha: 70.39, Nimp: 1, C: 255, Cdc: 3 },
  { mu: 0.9, alpha: 70.39, Nimp: 10, C: 2218, Cdc: 31 },
  { mu: 0.9, alpha: 70.39, Nimp: 100, C: 8194, Cdc: 313 },
  { mu: 0.9, alpha: 70.39, Nimp: 1000, C: 27524, Cdc: 3120 },
  { mu: 1.0, alpha: 69.93, Nimp: 1, C: 317, Cdc: 3 },
  { mu: 1.0, alpha: 69.93, Nimp: 10, C: 2425, Cdc: 31 },
  { mu: 1.0, alpha: 69.93, Nimp: 100, C: 8417, Cdc: 313 },
  { mu: 1.0, alpha: 69.93, Nimp: 1000, C: 27881, Cdc: 3120  },
];

export const Lab3 = () => {
  const [mu, setMu] = useState("0.1");
  const [Nimp, setNimp] = useState("1");
  const [Nt, setNt] = useState("10000");
  const [Plaser, setPlaser] = useState("5.62e-6");
  const [lambda, setLambda] = useState("1740");
  const [nu0, setNu0] = useState("5e6");
  const [Cdc, setCdc] = useState("313");

  const results = useMemo(() => {
    const muVal = parseFloat(mu);
    const NimpVal = parseFloat(Nimp);
    const NtVal = parseFloat(Nt);
    const PlaserVal = parseFloat(Plaser);
    const lambdaVal = parseFloat(lambda);
    const nu0Val = parseFloat(nu0);
    const CdcVal = parseFloat(Cdc);

    const lambda_m = lambdaVal * 1e-9;
    const P0 = (c * nu0Val * h * muVal) / lambda_m;
    const alpha = 10 * Math.log10(PlaserVal / P0);
    const Nph = (PlaserVal * lambda_m) / (h * c * nu0Val);
    const N = NimpVal * NtVal * Nph * Math.pow(10, -0.1 * alpha);
    const preset = presetData.find(d => d.mu === muVal && d.Nimp === NimpVal);
    const C = preset ? preset.C : N * 0.03 + CdcVal;
    const QE = ((C - CdcVal) / N) * 100;
    return { P0, alpha, Nph, N, C, QE };
  }, [mu, Nimp, Nt, Plaser, lambda, nu0, Cdc]);


  const dataSeries = presetData.filter(d => d.Nimp === parseFloat(Nimp)).map(d => {
    const lambda_m = parseFloat(lambda) * 1e-9;
    const P0 = (c * parseFloat(nu0) * h * d.mu) / lambda_m;
    const alpha = 10 * Math.log10(parseFloat(Plaser) / P0);
    const Nph = (parseFloat(Plaser) * lambda_m) / (h * c * parseFloat(nu0));
    const N = d.Nimp * parseFloat(Nt) * Nph * Math.pow(10, -0.1 * d.alpha);
    const QE = ((d.C - d.Cdc) / N) * 100;
    return { mu: d.mu, QE: QE.toFixed(2), N: N,
      C:d.C, Cdc:d.Cdc, alpha: alpha, Nph: Nph, P0: P0 };
  });

  return (
    <div className="lab-qe">
      <div className="card">
        <h2>Параметры эксперимента (вводимые пользователем)</h2>
        <div className="inputs">
          <label>
            Импульсов в трейне
            <select onChange={e => setNimp(e.target.value)} defaultValue={1}>
              <option value={1}>1</option>
              <option value={10}>10</option>
              <option value={100}>100</option>
              <option value={1000}>1000</option>
            </select>
          </label>

        </div>
      </div>
      <div className="card">
        <h2>Экспериментальные данные</h2>
        <table className="results-table">
          <thead>
          <tr>
            <th>μ</th>
            <th>Аттенюация (дБ)</th>
            <th>Мощность на входе ДОФ (дБ)</th>
            <th>Фотонов до аттенюации</th>
            <th>Срабатывания C</th>
            <th>Темновые C<sub>dc</sub></th>
            <th>N (пришедших фотонов)</th>
            <th>QE (%)</th>
          </tr>
          </thead>
          <tbody>
          {dataSeries.map((d, i) => (
            <tr key={i}>
              <td>{d.mu}</td>
              <td>{d.alpha.toFixed(2)}</td>
              <td>{d.P0}</td>
              <td>{d.Nph.toFixed(2)}</td>
              <td>{d.C}</td>
              <td>{d.Cdc}</td>
              <td>{d.N.toFixed(2)}</td>
              <td>{d.QE}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>График зависимости QE от μ</h2>
        <LineChart width={600} height={300} data={dataSeries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mu" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="QE" stroke="#8884d8"
                name="QE, %" />
        </LineChart>
      </div>

      <div className="card">
        <h2>График числа зарегистрированных фотонов C от μ</h2>
        <LineChart width={600} height={300} data={dataSeries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mu" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="C" stroke="#82ca9d"
                name="Фотонов на входе ДОФ" />
        </LineChart>
      </div>
    </div>
  );
}
