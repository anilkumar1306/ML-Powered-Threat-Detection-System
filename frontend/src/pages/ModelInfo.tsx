import { Shield, GitBranch, Share2, Network, Brain } from 'lucide-react';

const ModelInfo = () => {
    const models = [
        {
            name: 'Random Forest',
            icon: Network,
            description: 'A versatile ensemble method that constructs multiple decision trees during training and outputs the class that is the mode of the classes.',
            strengths: ['High accuracy', 'Handles non-linear data well', 'Robust to outliers'],
            weaknesses: ['Can be slow to predict', 'Large model size'],
            useCase: 'General purpose threat detection with balanced precision and recall.'
        },
        {
            name: 'XGBoost',
            icon: Shield,
            description: 'An optimized distributed gradient boosting library designed to be highly efficient, flexible and portable.',
            strengths: ['State-of-the-art performance', 'Handles missing values', 'Regularization prevents overfitting'],
            weaknesses: ['Sensitive to hyperparameters', 'Black-box nature'],
            useCase: 'When maximum accuracy is required and computational resources are available.'
        },
        {
            name: 'Decision Tree',
            icon: GitBranch,
            description: 'A flowchart-like structure where an internal node represents a feature, the branch represents a decision rule, and each leaf node represents the outcome.',
            strengths: ['Easy to interpret', 'Fast training and prediction', 'Requires little data preparation'],
            weaknesses: ['Prone to overfitting', 'Unstable with small data variations'],
            useCase: 'When explainability is critical and the dataset is simple.'
        },
        {
            name: 'Gradient Boosting',
            icon: Share2,
            description: 'An ensemble technique that builds models sequentially, with each new model attempting to correct the errors of the previous ones.',
            strengths: ['High predictive accuracy', 'Flexible with different loss functions'],
            weaknesses: ['Sensitive to noisy data', 'Longer training time'],
            useCase: 'Complex datasets with subtle patterns.'
        },
        {
            name: 'Logistic Regression',
            icon: Brain,
            description: 'A statistical model used for binary classification, modeling the probability of a certain class or event.',
            strengths: ['Simple and interpretable', 'Fast training', 'Low resource usage'],
            weaknesses: ['Assumes linearity', 'Not suitable for complex relationships'],
            useCase: 'Baseline model and when low latency is the top priority.'
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-200">Model Documentation</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {models.map((model) => (
                    <div key={model.name} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-colors">
                        <div className="p-3 bg-slate-800 w-fit rounded-lg mb-4">
                            <model.icon className="h-6 w-6 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">{model.name}</h3>
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                            {model.description}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Strengths</h4>
                                <ul className="space-y-1">
                                    {model.strengths.map(s => (
                                        <li key={s} className="text-slate-500 text-xs flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Weaknesses</h4>
                                <ul className="space-y-1">
                                    {model.weaknesses.map(w => (
                                        <li key={w} className="text-slate-500 text-xs flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                                            {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-xs text-slate-400">
                                    <span className="font-semibold text-cyan-500">Best for: </span>
                                    {model.useCase}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                        <Shield className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Anomaly Detection Override</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                            The system employs an <strong>Isolation Forest</strong> algorithm alongside the selected supervised model.
                            Regardless of the supervised model's prediction, if the Isolation Forest detects a data point as an anomaly
                            (a rare outlier significantly different from normal traffic), it will tag it as <span className="text-orange-400 font-medium">ANOMALY</span>.
                            This serves as a safety net for zero-day attacks that the supervised models may not yet recognize.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelInfo;
